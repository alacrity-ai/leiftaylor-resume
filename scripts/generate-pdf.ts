/**
 * Generates the PDF résumé(s) from the prerendered print routes. Loops
 * over `[null, ...VARIANT_SLUGS]` so each registered variant gets its
 * own PDF emitted to `public/<slug>/leif-taylor-resume-<slug>-...pdf`.
 *
 * Pipeline:
 *   1. Confirm dist/ has the expected prerendered routes.
 *   2. Boot a tiny in-process static server pointing at dist/.
 *   3. Launch Puppeteer ONCE — re-used across slugs.
 *   4. For each slug: navigate, wait for fonts, sanity-check ATS keywords
 *      from the variant's resolved RESUME, render PDF.
 *   5. Tear down server + browser.
 *
 * Single-variant mode: set `RESUME_SLUG=<slug>` to render only that one
 * (used by `make resume-pdf-slug SLUG=...`). Setting `RESUME_SLUG=base`
 * renders only the global. Otherwise all of `[null, ...VARIANT_SLUGS]`.
 */
import { createServer, type Server } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, { type Browser } from 'puppeteer';

import { resolveVariant } from '../src/content/resolve-variant';
import { VARIANT_SLUGS } from '../src/content/variants';
import { UI } from '../src/content/ui';
import { titleCaseLabel } from '../src/content/content-utils';
import type { Resume } from '../src/content/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

/** Build the required-keyword list from a (resolved) RESUME. The check
 *  fails if any of these are missing in the rendered PDF text. */
function buildRequiredKeywords(resume: Resume): string[] {
  const m = resume.meta;
  const identity = [
    m.name,
    m.email,
    m.location,
    ...m.titleStack.split(/\s*·\s*/),
  ];
  const sectionHeads = [
    titleCaseLabel(resume.sections.operatingModel.label),
    resume.sections.impact.label,
    resume.sections.experience.label,
    UI.print.consultingHeading,
    resume.sections.tech.label,
  ];
  const outcomeAnchors = resume.impact.map((i) => i.value);
  const companies = Array.from(
    new Set(resume.experience.flatMap((e) => e.cards.map((c) => c.company))),
  );
  const roles = Array.from(
    new Set(resume.experience.flatMap((e) => e.cards.map((c) => c.role))),
  );
  return [
    ...identity,
    ...sectionHeads,
    ...outcomeAnchors,
    ...companies,
    ...roles,
    ...resume.atsFeaturedPills,
  ];
}

/** Output path for a slug's PDF: variant goes under `<slug>/`. */
function pdfOutPath(resume: Resume): string {
  const href = resume.meta.pdfHref; // already variant-aware via resolveVariant
  return join(ROOT, 'public', href.replace(/^\//, ''));
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
};

function startServer(root: string): Promise<{
  url: string;
  close: () => Promise<void>;
}> {
  return new Promise((resolve, reject) => {
    const server: Server = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent((req.url ?? '/').split('?')[0]);
        if (p.endsWith('/')) p += 'index.html';
        const full = join(root, p);
        if (!full.startsWith(root)) {
          res.writeHead(403);
          res.end('forbidden');
          return;
        }
        let target = full;
        try {
          const s = await stat(full);
          if (s.isDirectory()) {
            target = join(full, 'index.html');
          }
        } catch {
          target = join(full, 'index.html');
        }
        try {
          const data = await readFile(target);
          const ext = extname(target).toLowerCase();
          res.writeHead(200, {
            'content-type': MIME[ext] ?? 'application/octet-stream',
            'cache-control': 'no-store',
          });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end('not found');
        }
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        resolve({
          url: `http://127.0.0.1:${addr.port}`,
          close: () =>
            new Promise<void>((r) => {
              server.close(() => r());
            }),
        });
      } else {
        reject(new Error('server.address() did not return an AddressInfo'));
      }
    });
  });
}

/** Render one slug's PDF. The browser is shared across calls. */
async function renderPdfForSlug(
  browser: Browser,
  serverUrl: string,
  slug: string | null,
): Promise<void> {
  const resolved = resolveVariant(slug);
  if (resolved === null) {
    throw new Error(`resolveVariant returned null for slug ${JSON.stringify(slug)}`);
  }
  const { resume } = resolved;
  const printPath = slug ? `/${slug}/print/resume` : '/print/resume';
  const out = pdfOutPath(resume);
  // Ensure variant subdir exists.
  mkdirSync(dirname(out), { recursive: true });

  const printIndex = join(DIST, slug ? `${slug}/print/resume/index.html` : 'print/resume/index.html');
  if (!existsSync(printIndex)) {
    throw new Error(
      `${printIndex} missing. Run \`npm run build\` first to generate the prerendered HTML.`,
    );
  }

  const page = await browser.newPage();
  page.on('pageerror', (err) => console.error('  page error:', err));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('  console error:', msg.text());
  });

  try {
    const target = `${serverUrl}${printPath}`;
    console.log(`  → [${slug ?? 'base'}] navigating to ${target}`);
    await page.goto(target, { waitUntil: 'networkidle0', timeout: 60_000 });

    await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (globalThis as any).document.fonts.ready;
    });
    await new Promise((r) => setTimeout(r, 400));

    const text: string = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (globalThis as any).document.body.textContent as string;
    });
    const required = buildRequiredKeywords(resume);
    const missing = required.filter((k) => !text.includes(k));
    if (missing.length > 0) {
      console.error(`  ✗ [${slug ?? 'base'}] missing keywords:`, missing);
      throw new Error(`Missing ATS keywords for slug ${slug ?? 'base'}`);
    }
    console.log(`  ✓ [${slug ?? 'base'}] all ${required.length} ATS keywords present`);

    await page.pdf({
      path: out,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.55in',
        right: '0.55in',
      },
      displayHeaderFooter: false,
    });

    const { size } = await stat(out);
    console.log(`✓ wrote ${out} (${(size / 1024).toFixed(1)} KB)`);
  } finally {
    await page.close();
  }
}

async function main() {
  const baseSlug = process.env.RESUME_SLUG;
  // Slug filter:
  //   unset       → render all (base + variants)
  //   "base"      → render only the base
  //   "<slug>"    → render only that one
  let slugsToRender: (string | null)[];
  if (baseSlug === undefined) {
    slugsToRender = [null, ...VARIANT_SLUGS];
  } else if (baseSlug === 'base' || baseSlug === '') {
    slugsToRender = [null];
  } else {
    if (!VARIANT_SLUGS.includes(baseSlug)) {
      console.error(
        `✗ RESUME_SLUG=${JSON.stringify(baseSlug)} is not a registered variant. ` +
          `Known variants: ${VARIANT_SLUGS.join(', ') || '(none)'}.`,
      );
      process.exit(1);
    }
    slugsToRender = [baseSlug];
  }

  console.log('  → starting static server');
  const { url, close: closeServer } = await startServer(DIST);
  console.log(`  → serving ${DIST} at ${url}`);

  console.log('  → launching Chromium');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const slug of slugsToRender) {
      await renderPdfForSlug(browser, url, slug);
    }
  } finally {
    await browser.close();
    await closeServer();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
