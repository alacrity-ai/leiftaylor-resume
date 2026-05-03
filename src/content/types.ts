/**
 * Public type surface for the variant system. Composes the base
 * `Resume` and `UI` shapes from the existing data files and adds the
 * `Variant` type that per-company override files conform to.
 */
import type { RESUME } from './resume';
import type { UI as UIShape } from './ui';

/** The full base résumé content. Inferred from the canonical `RESUME`. */
export type Resume = typeof RESUME;

/** The full UI string surface. Re-exported from `ui.ts`. */
export type UI = UIShape;

/**
 * Recursive partial used for variant overrides.
 *
 * - Objects: each key is optional and recursively `DeepPartial`'d.
 * - Arrays: variant either omits (falls through to base) OR provides a
 *   complete replacement array. We deliberately do NOT allow per-element
 *   partials — keeping the merge predictable and sidestepping
 *   "partial-by-id" infrastructure.
 * - Primitives: replaced wholesale.
 *
 * The mapped form preserves strict typing — typo'd field names produce
 * a TS error at the variant declaration site (excess property check).
 */
export type DeepPartial<T> = T extends ReadonlyArray<infer U>
  ? U[]
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/**
 * Variant-only intro card shown above the hero on a tailored slug.
 * Renders as a full-bleed band with a paper-tinted background and
 * oxblood rules. Optional CTA opens in a new tab.
 */
export interface Hello {
  /** Short addressing line ("For Anthropic."). */
  title: string;
  /** 1–3 sentences naming the role and the fit. */
  body: string;
  /** Optional CTA — typically a JD link. */
  cta?: { label: string; href: string };
}

/**
 * One company-tailored override of the base résumé. Lives at
 * `src/content/variants/<slug>.ts` and is registered in
 * `src/content/variants/index.ts`.
 */
export interface Variant {
  /** URL slug — lowercase alphanumeric + hyphens. Drives `/<slug>` and
   *  output filenames like `<slug>/leif-taylor-resume-<slug>-...`. */
  slug: string;
  /** Display name used in build logs and the hello card. */
  company: string;
  /** Partial overrides on the base résumé. Anything left out falls
   *  through to base. Arrays are replaced wholesale. */
  resume?: DeepPartial<Resume>;
  /** Partial overrides on the base UI strings. */
  ui?: DeepPartial<UI>;
  /** Optional hello card rendered above the hero on this variant. */
  hello?: Hello;
  /** When true, the slug 404s instead of rendering. Useful for
   *  retiring a tailored URL after the application closes without
   *  deleting the source file. */
  archived?: boolean;
}

/** What `resolveVariant(slug)` returns when the slug resolves cleanly. */
export interface ResolvedVariant {
  resume: Resume;
  ui: UI;
  hello?: Hello;
  /** Slug of the resolved variant, or `null` for the global. */
  slug: string | null;
  /** Display company name, or `null` for the global. */
  company: string | null;
}
