/**
 * Template for a new company-tailored variant.
 *
 * To use:
 *   1. cp _template.ts <slug>.ts          (e.g. cp _template.ts anthropic.ts)
 *   2. Replace `template` in this file's variable name and `slug` field
 *      with the company slug (lowercase, alphanumeric + hyphens).
 *   3. Fill in `company` and the `hello` block with the role-specific
 *      hook.
 *   4. Override only the fields that need retuning. Anything you leave
 *      out falls through to base RESUME / UI.
 *   5. Register the import in `./index.ts`.
 *   6. `make resumes-all && make deploy`.
 *
 * Override semantics:
 *
 *   - Any field omitted → base value used (variant inherits from RESUME).
 *   - Object fields → merged recursively. You can override just `hero.tagline`
 *     and the rest of `hero` (eyebrow, body, glance, etc.) inherits.
 *   - Array fields (impact, systems, experience, tech) → REPLACED WHOLESALE.
 *     If you want to reorder `impact`, list out the full new array in the
 *     order you want. Same for `tech.pills` (provide the entire bucket).
 *
 * Locked fields (do NOT override unless you really mean to):
 *   - resume.experience — career history is fact, not pitch
 *   - resume.background — global
 *   - resume.meta.email / linkedin / pdfHref / docxHref — global
 *
 * Variants are dispatch URLs — `<meta robots noindex,nofollow>` is added
 * automatically and the slug appears in `robots.txt` `Disallow:`. Don't
 * advertise the variant URL anywhere public.
 */
import type { Variant } from '../types';

export const template: Variant = {
  slug: 'template',
  company: 'Template Co.',

  hello: {
    title: 'For Template Co.',
    body:
      'A 1–3 sentence hook addressed to the company. Name the specific role and why this version of the résumé is the right shape for it. Keep it tight — this card sits above the hero and should read like a personal note, not marketing copy.',
    cta: { label: 'Open the JD →', href: 'https://example.com/job-posting' },
  },

  resume: {
    meta: {
      // Retune the title for SEO + the schema.org Person card.
      // titleStack: 'AI-Native Principal Engineer · Forward-Deployed',
      // jobTitle: 'AI-Native Principal Engineer · Forward-Deployed',
      // worksFor: { name: 'Template Co.', url: 'https://example.com' },
    },
    hero: {
      // Match titleStack uppercased.
      // eyebrow: 'AI-NATIVE PRINCIPAL ENGINEER · FORWARD-DEPLOYED',
      // tagline: 'Rewritten thesis statement leading with what this role values.',
      // body: '2–3 sentences specifically connecting the résumé to the role.',
    },
    // Reorder the 9 base outcomes so the most relevant 5–9 lead.
    // Provide the FULL new array. Items not present in base will
    // type-check fail.
    // impact: [
    //   { value: 'AI matching', label: '...' },
    //   { value: 'AI moderation', label: '...' },
    //   ...
    // ],
    // Reorder/replace the 6 toolkit buckets if needed.
    // tech: [
    //   { label: 'AI / LLM Systems', pills: [...] },
    //   ...
    // ],
    contact: {
      // heading: 'Available for the Template Co. Forward-Deployed Engineer role.',
      // body: 'Greater Boston Area · Open to remote or hybrid for the right team.',
    },
  },

  // ui: { … }   — rare; only override if a CTA label needs to change.

  // archived: false,   — flip to true to retire this variant (URL 404s).
};
