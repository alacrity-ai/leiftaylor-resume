/**
 * Writes dist/sitemap.xml. The site is a single page; sitemap is one URL plus
 * the PDF. Keep it explicit so search engines have no excuse to miss either.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RESUME } from '../src/content/resume';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const TODAY = new Date().toISOString().slice(0, 10);

const entries = [
  { loc: `${RESUME.meta.siteUrl}/`,                                   lastmod: TODAY,                     changefreq: 'monthly', priority: '1.0' },
  { loc: `${RESUME.meta.siteUrl}${RESUME.meta.pdfHref}`,              lastmod: RESUME.meta.lastReviewed,  changefreq: 'yearly',  priority: '0.5' },
];

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
