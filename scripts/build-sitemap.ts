/**
 * Writes dist/sitemap.xml. Only the global home + global PDF/DOCX are
 * listed — variants are dispatch URLs (see DATA_DRIVEN_APPROACH.md §6)
 * and intentionally excluded.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RESUME } from '../src/content/resume';
import { VARIANT_SLUGS } from '../src/content/variants';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const TODAY = new Date().toISOString().slice(0, 10);

const entries = [
  { loc: `${RESUME.meta.siteUrl}/`,                                   lastmod: TODAY,                     changefreq: 'monthly', priority: '1.0' },
  { loc: `${RESUME.meta.siteUrl}${RESUME.meta.pdfHref}`,              lastmod: RESUME.meta.lastReviewed,  changefreq: 'yearly',  priority: '0.5' },
];

// Defensive — if a future change accidentally added variants to the
// sitemap, fail the build rather than ship a leak.
for (const e of entries) {
  for (const slug of VARIANT_SLUGS) {
    if (e.loc.includes(`/${slug}/`) || e.loc.endsWith(`/${slug}`)) {
      throw new Error(
        `sitemap entry ${JSON.stringify(e.loc)} references variant slug ${JSON.stringify(slug)}. ` +
          'Variants must not appear in sitemap.xml — they are dispatch URLs.',
      );
    }
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  ),
  '</urlset>',
  '',
].join('\n');

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ wrote sitemap.xml (${entries.length} urls)`);
