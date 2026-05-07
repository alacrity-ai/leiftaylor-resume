/**
 * Renders public/og-image.svg → PNG at 1200×630 using sharp. Loops over
 * `[null, ...VARIANT_SLUGS]` so each variant gets its own rasterized OG
 * image (link previewers like Slack, iMessage, LinkedIn don't render
 * SVG reliably — PNG is the safe format).
 *
 * The SVG is a template with `{{TOKEN}}` placeholders substituted from
 * the resolved RESUME for each slug. Variants get a "FOR <COMPANY>"
 * note in the footer so the preview reads as tailored.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

import { resolveVariant } from '../src/content/resolve-variant';
import { VARIANT_SLUGS } from '../src/content/variants';
import { siteHostLabel } from '../src/content/content-utils';
import type { Resume } from '../src/content/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');

/** Escape XML special characters so user content is safe inside <text>. */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Format the date in the OG footer like "2026·05·02". */
function formatReviewedDate(iso: string): string {
  return iso.replace(/-/g, '·');
}

/** Build the per-slug substituted SVG string. */
function svgForSlug(template: string, resume: Resume, company: string | null): string {
  const m = resume.meta;
  const eyebrow = m.titleStack.toUpperCase().replace(/\s*·\s*/g, '  ·  ');
  const [tagline1, tagline2] = m.ogTaglineLines;
  const reviewed = `REVIEWED ${formatReviewedDate(m.lastReviewed)}`;
  const footer = company
    ? `FOR ${company.toUpperCase()}  ·  ${reviewed}`
    : `${siteHostLabel(m.siteUrl).toUpperCase()}  ·  ${reviewed}`;

  // `replaceAll` (not `replace`) — the SVG template documents tokens in
  // HTML comments next to the `<text>` nodes that consume them
  // (e.g. `<!-- Mono eyebrow ({{EYEBROW}} = ...) -->`). With single
  // `replace` only the first occurrence (the comment) is substituted,
  // leaving the visible `<text>` rendered as the literal token.
  return template
    .replaceAll('{{EYEBROW}}', xmlEscape(eyebrow))
    .replaceAll('{{NAME}}', xmlEscape(m.name))
    .replaceAll('{{TAGLINE_1}}', xmlEscape(tagline1))
    .replaceAll('{{TAGLINE_2}}', xmlEscape(tagline2))
    .replaceAll('{{FOOTER}}', xmlEscape(footer));
}

/** Output PNG path: global → public/og-image.png; variant → public/<slug>/og-image.png. */
function pngPathForSlug(slug: string | null): string {
  return slug ? join(PUBLIC, slug, 'og-image.png') : join(PUBLIC, 'og-image.png');
}

async function renderForSlug(template: string, slug: string | null): Promise<void> {
  const resolved = resolveVariant(slug);
  if (resolved === null) {
    throw new Error(`resolveVariant returned null for ${JSON.stringify(slug)}`);
  }
  const svg = svgForSlug(template, resolved.resume, resolved.company);
  const png = await sharp(Buffer.from(svg), { density: 96 })
    .resize(1200, 630, { fit: 'contain', background: { r: 250, g: 250, b: 247, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const out = pngPathForSlug(slug);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, png);
  console.log(`✓ [${slug ?? 'base'}] wrote ${out} (${(png.byteLength / 1024).toFixed(1)} KB)`);
}

async function main() {
  const template = readFileSync(join(PUBLIC, 'og-image.svg'), 'utf8');
  const slugs: (string | null)[] = [null, ...VARIANT_SLUGS];
  for (const slug of slugs) {
    await renderForSlug(template, slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
