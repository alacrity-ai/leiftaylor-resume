/**
 * Variant resolution + deep-merge utility. Given an optional slug,
 * returns the merged `{ resume, ui, hello }` bundle the page should
 * render, or `null` when the slug is provided but does not match any
 * registered variant (callers render 404 in that case).
 */
import { RESUME } from './resume';
import { UI } from './ui';
import { VARIANTS } from './variants';
import type { ResolvedVariant, Resume, UI as UIType } from './types';

/**
 * Given a base artifact href (e.g., `/leif-taylor-resume-2026-05.pdf`)
 * and a variant slug, return the variant's artifact href under its slug
 * folder with the slug embedded in the filename:
 *
 *   `/leif-taylor-resume-2026-05.pdf`  →
 *   `/anthropic/leif-taylor-resume-anthropic-2026-05.pdf`
 *
 * Keeps recruiters' downloads disambiguated months later in their
 * Downloads folder.
 */
export function variantArtifactHref(baseHref: string, slug: string): string {
  const noLeadingSlash = baseHref.replace(/^\//, '');
  const dotIdx = noLeadingSlash.lastIndexOf('.');
  const stem = dotIdx === -1 ? noLeadingSlash : noLeadingSlash.slice(0, dotIdx);
  const ext = dotIdx === -1 ? '' : noLeadingSlash.slice(dotIdx);
  // Match `<prefix>-YYYY-MM` and inject the slug between prefix and date.
  const m = stem.match(/^(.+?)-(\d{4}-\d{2})$/);
  if (!m) {
    return `/${slug}/${stem}-${slug}${ext}`;
  }
  const [, prefix, date] = m;
  return `/${slug}/${prefix}-${slug}-${date}${ext}`;
}

/**
 * Recursively merge `override` onto `base`. Arrays in `override`
 * replace the corresponding base array wholesale (no per-element
 * merge). Plain objects merge by key. Primitives in `override`
 * replace. `undefined` in `override` keeps the base value.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined) return base;
  if (override === null) return override as T;
  if (Array.isArray(override)) return override as T;
  if (typeof override !== 'object') return override as T;
  if (typeof base !== 'object' || base === null || Array.isArray(base)) {
    return override as T;
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    result[key] = deepMerge(
      (base as Record<string, unknown>)[key],
      (override as Record<string, unknown>)[key],
    );
  }
  return result as T;
}

/**
 * Resolve a slug to a `{ resume, ui, hello, slug, company }` bundle.
 *
 * - `slug` empty/null → returns the global (base data, slug=null).
 * - `slug` matches a registered, non-archived variant → returns the
 *   merged bundle.
 * - `slug` does not match → returns `null` (callers render 404).
 *
 * Build scripts iterate `VARIANTS` directly and can assert the result
 * is non-null.
 */
export function resolveVariant(slug?: string | null): ResolvedVariant | null {
  if (!slug) {
    return { resume: RESUME, ui: UI, slug: null, company: null };
  }
  const variant = VARIANTS.find((v) => v.slug === slug && !v.archived);
  if (!variant) return null;
  const merged = variant.resume ? deepMerge<Resume>(RESUME, variant.resume) : RESUME;
  // Variant artifact paths are computed, not authored — keep meta.pdfHref
  // / docxHref strictly slug-derived so a typo in a variant file can't
  // produce a 404 download.
  const resume: Resume = {
    ...merged,
    meta: {
      ...merged.meta,
      pdfHref: variantArtifactHref(RESUME.meta.pdfHref, variant.slug),
      docxHref: variantArtifactHref(RESUME.meta.docxHref, variant.slug),
    },
  };
  const ui = variant.ui ? deepMerge<UIType>(UI, variant.ui) : UI;
  return {
    resume,
    ui,
    hello: variant.hello,
    slug: variant.slug,
    company: variant.company,
  };
}
