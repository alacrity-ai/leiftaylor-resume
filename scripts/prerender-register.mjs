/**
 * Pre-loader for prerender.ts. Registers a no-op asset loader so we can
 * import the React tree under Node without choking on CSS/SVG.
 *
 * tsx itself is loaded separately via `--import tsx`.
 *
 * Run with:
 *   node --import tsx --import ./scripts/prerender-register.mjs prerender.ts
 */
import { register } from 'node:module';

register('./prerender-loader.mjs', import.meta.url);
