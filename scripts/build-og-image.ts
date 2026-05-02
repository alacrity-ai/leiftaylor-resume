/**
 * Renders public/og-image.svg → public/og-image.png at 1200×630 using sharp.
 * Runs at build time. The PNG is what link previewers use — Slack, iMessage,
 * LinkedIn, X, Threads, Discord all rasterize PNG; SVG support is uneven.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const svg = readFileSync(join(PUBLIC, 'og-image.svg'));

const png = await sharp(svg, { density: 96 })
  .resize(1200, 630, { fit: 'contain', background: { r: 250, g: 250, b: 247, alpha: 1 } })
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(join(PUBLIC, 'og-image.png'), png);
console.log(`✓ wrote og-image.png (${(png.byteLength / 1024).toFixed(1)} KB)`);
