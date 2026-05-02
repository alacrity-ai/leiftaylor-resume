/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages Function: POST /api/contact.
 *
 * Pipeline:
 *   1. Method gate (POST only).
 *   2. JSON parse + size limit (8 KB).
 *   3. Honeypot — silently OK if filled (don't reveal we caught the bot).
 *   4. Turnstile siteverify.
 *   5. Hand-rolled validation.
 *   6. Per-IP rate limit (5/hour) via the Cache API.
 *   7. Mailgun POST.
 *
 * Secrets (`wrangler pages secret put …`):
 *   MAILGUN_API_KEY, MAILGUN_DOMAIN, TURNSTILE_SECRET, NOTIFY_TO
 *
 * Pattern lifted from interior-painter-website/functions/api/contact.ts —
 * adapted to the resume's field set (no town / timeframe / scope).
 */

interface Env {
  MAILGUN_API_KEY: string;
  MAILGUN_DOMAIN: string;
  TURNSTILE_SECRET: string;
  NOTIFY_TO: string;
}

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  reason: string;
  hp_website?: string;
  turnstileToken: string;
}

const MAX_BODY_BYTES = 8_192;
const RATE_LIMIT_WINDOW_SEC = 3_600;
const RATE_LIMIT_MAX = 5;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'invalid', message: 'Method not allowed' }, 405);
  }

  const cl = Number(request.headers.get('content-length') ?? '0');
  if (cl > MAX_BODY_BYTES) return json({ ok: false, error: 'invalid', message: 'Body too large' }, 413);

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: 'invalid', message: 'Invalid JSON' }, 400);
  }

  // Honeypot — if a bot filled the hidden field, return 200 silently.
  if (body.hp_website && body.hp_website.trim() !== '') {
    return json({ ok: true });
  }

  if (!body.turnstileToken) {
    return json({ ok: false, error: 'captcha', message: 'Missing captcha token' }, 400);
  }
  const captchaOk = await verifyTurnstile(
    env.TURNSTILE_SECRET,
    body.turnstileToken,
    request.headers.get('cf-connecting-ip'),
  );
  if (!captchaOk) {
    return json({ ok: false, error: 'captcha', message: 'Captcha failed — please try again.' }, 400);
  }

  const validation = validate(body);
  if (validation) {
    return json({ ok: false, error: 'invalid', message: validation }, 400);
  }

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const limited = await rateLimit(ip);
  if (limited) {
    return json(
      { ok: false, error: 'rate-limited', message: 'Too many requests — try again in an hour.' },
      429,
    );
  }

  const ua = (request.headers.get('user-agent') ?? '').slice(0, 200);
  const text = renderEmail(body, { ip, ua });

  const mgRes = await sendViaMailgun(env, body, text);
  if (!mgRes.ok) {
    console.error('mailgun error', mgRes.status, await mgRes.text().catch(() => ''));
    return json(
      { ok: false, error: 'internal', message: 'Could not send right now. Please try again shortly.' },
      502,
    );
  }

  return json({ ok: true });
};

// ── Validation ──────────────────────────────────────────────

function validate(b: ContactPayload): string | null {
  if (!str(b.name, 2, 100)) return 'Please share your name.';
  if (!isEmail(b.email)) return 'Email address looks off.';

  // Phone is optional. If provided, validate digit count.
  if (b.phone && b.phone.trim() !== '') {
    const phoneDigits = b.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return 'Phone number looks off.';
  }

  if (!str(b.reason, 20, 4000)) return 'A few sentences about why you’re reaching out, please.';
  return null;
}

function str(v: unknown, min: number, max: number): boolean {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}

function isEmail(v: unknown): boolean {
  if (typeof v !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 254;
}

// ── Turnstile ──────────────────────────────────────────────

async function verifyTurnstile(
  secret: string,
  token: string,
  ip: string | null,
): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { success?: boolean };
    return body.success === true;
  } catch {
    return false;
  }
}

// ── Rate limit ─────────────────────────────────────────────

/**
 * Cache-API based rate limit. We store one cached marker per IP per
 * window. Cheap and bounded; no KV namespace required.
 */
async function rateLimit(ip: string): Promise<boolean> {
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(`https://rate-limit.local/contact/${encodeURIComponent(ip)}`);
  const hit = await cache.match(key);
  let count = 0;
  if (hit) {
    const text = await hit.text();
    count = Number(text || '0');
  }
  if (count >= RATE_LIMIT_MAX) return true;
  const next = new Response(String(count + 1), {
    headers: { 'cache-control': `max-age=${RATE_LIMIT_WINDOW_SEC}` },
  });
  await cache.put(key, next);
  return false;
}

// ── Email ──────────────────────────────────────────────────

function renderEmail(b: ContactPayload, ctx: { ip: string; ua: string }): string {
  return [
    'New message from your résumé site',
    '',
    `Name:   ${b.name.trim()}`,
    `Email:  ${b.email.trim()}`,
    `Phone:  ${b.phone?.trim() || '—'}`,
    '',
    'Reason for reaching out:',
    b.reason.trim(),
    '',
    '—',
    `Submitted: ${new Date().toISOString()}`,
    `IP:        ${ctx.ip}`,
    `UA:        ${ctx.ua}`,
  ].join('\n');
}

async function sendViaMailgun(env: Env, b: ContactPayload, text: string) {
  const form = new FormData();
  form.append('from', `Leif Taylor Resume <resume@${env.MAILGUN_DOMAIN}>`);
  form.append('to', env.NOTIFY_TO);
  form.append('h:Reply-To', b.email.trim());
  form.append('subject', `New résumé contact — ${b.name.trim()}`);
  form.append('text', text);

  const auth = `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`;
  return fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: { Authorization: auth },
    body: form,
  });
}

// ── Helpers ────────────────────────────────────────────────

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
