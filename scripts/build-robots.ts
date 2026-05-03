/**
 * Writes dist/robots.txt. Generated at build time so every registered
 * variant gets an automatic `Disallow:` line — variants are dispatch
 * URLs, not advertised, and we explicitly tell crawlers not to index
 * them.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RESUME } from '../src/content/resume';
import { VARIANT_SLUGS } from '../src/content/variants';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const lines: string[] = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /print/',
];

if (VARIANT_SLUGS.length > 0) {
  lines.push('');
  lines.push('# Variant brochures are private dispatch URLs — do not index.');
  for (const slug of VARIANT_SLUGS) {
    lines.push(`Disallow: /${slug}/`);
  }
}

lines.push('');
lines.push(`Sitemap: ${RESUME.meta.siteUrl}/sitemap.xml`);
lines.push('');

mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, 'robots.txt'), lines.join('\n'), 'utf8');
console.log(`✓ wrote robots.txt (${VARIANT_SLUGS.length} variant disallows)`);
