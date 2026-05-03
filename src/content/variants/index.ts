/**
 * Variant registry — the single source of truth for which slugs are
 * live on the site. Every per-company override file gets imported here
 * and added to `VARIANTS`. Build scripts iterate this list to fan out
 * prerender, PDF, DOCX, OG image, and robots.txt entries.
 *
 * To add a new variant:
 *   1. cp src/content/variants/_template.ts src/content/variants/<slug>.ts
 *   2. fill in the new file
 *   3. import + register here
 *   4. `make resumes-all` to regenerate artifacts
 *   5. `make deploy`
 */
import type { Variant } from '../types';

// Each variant is imported and added below. Keep alphabetical.
import { adobe } from './adobe';
import { anthropic } from './anthropic';

export const VARIANTS: readonly Variant[] = [
  adobe,
  anthropic,
] as const;

export const VARIANT_SLUGS: readonly string[] = VARIANTS.map((v) => v.slug);

// ─── Slug validation ──────────────────────────────────────────
//
// Run at module load so a malformed slug crashes the dev server / build
// immediately with a clear message, rather than silently rendering at
// the wrong URL.

/** URLs we own and don't want collided with. Variants cannot use these slugs. */
const RESERVED_SLUGS = new Set([
  'print',
  'api',
  'assets',
  '_template',
  'admin',
  'static',
]);

/** Slug must be lowercase alphanumeric + hyphens, no leading/trailing hyphen. */
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

for (const v of VARIANTS) {
  if (!SLUG_RE.test(v.slug)) {
    throw new Error(
      `Variant slug ${JSON.stringify(v.slug)} is malformed. ` +
        `Slugs must be lowercase alphanumeric + hyphens, e.g. "anthropic" or "openai-frontier".`,
    );
  }
  if (RESERVED_SLUGS.has(v.slug)) {
    throw new Error(
      `Variant slug ${JSON.stringify(v.slug)} is reserved (clashes with a system route).`,
    );
  }
}

const seen = new Set<string>();
for (const v of VARIANTS) {
  if (seen.has(v.slug)) {
    throw new Error(`Duplicate variant slug: ${JSON.stringify(v.slug)}`);
  }
  seen.add(v.slug);
}
