/**
 * Node ESM loader that no-ops CSS / SVG / image imports so tsx can import
 * the React tree for prerendering. Vite normally handles these; we don't
 * run Vite during prerender.
 */
const NOOP_EXTS = ['.css', '.scss', '.svg', '.png', '.jpg', '.jpeg', '.webp'];

export async function load(url, context, nextLoad) {
  if (NOOP_EXTS.some((ext) => url.endsWith(ext))) {
    return {
      format: 'module',
      source: 'export default {};',
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
