# Leif Taylor — Living Résumé

> Live at **[resume.lalalimited.com](https://resume.lalalimited.com)**

The brochure site, the typeset PDF, and the ATS-friendly Word document are all rendered from a single TypeScript file. One source of truth, three output formats, one mailbox. Built with [Claude Code](https://claude.com/claude-code) — the agentic-delivery thesis the résumé itself argues, demonstrated by the repository it lives in.

---

## What this is

A personal résumé site for Leif Taylor — AI-Native Principal Engineer & Product-to-Production Architect — that doubles as the canonical generator for two downstream artifacts:

1. **The interactive web brochure** at [resume.lalalimited.com](https://resume.lalalimited.com)
2. **A typeset PDF résumé** rendered via Puppeteer at build time
3. **An ATS-friendly DOCX résumé** built from the same data through the [`docx`](https://docx.js.org/) package

Every string on every surface lives in one file: [`src/content/resume.ts`](./src/content/resume.ts). Edit it, run `make resumes`, run `make deploy`. The site, PDF, and DOCX update in lockstep automatically.

---

## Stack

- **Runtime:** Node 24
- **Build:** Vite 6 + React 19 + TypeScript 5
- **Hosting:** Cloudflare Pages with one Pages Function for the contact mailer
- **PDF generation:** Puppeteer (bundled Chromium) renders a print-specific React route to a deterministic PDF
- **DOCX generation:** [`docx`](https://docx.js.org/) builds an ATS-friendly Word document directly from the source data
- **Email delivery:** Mailgun, called from the Pages Function with Turnstile-gated input
- **Typography:** Fraunces (display) · Geist (body) · JetBrains Mono (mono) — all open-licensed via Google Fonts

No CMS. No backend besides the contact mailer. Pure static deployment to the edge.

---

## Quick start

```bash
nvm use 24
make install
make dev          # http://localhost:5173
```

The dev server hot-reloads on edits to any file in `src/`. The `/print/resume` route renders the PDF-shaped layout — handy for previewing PDF changes without running the full Puppeteer pipeline.

---

## Editing content

For **global** changes (everything that lives on `resume.lalalimited.com/`), edit [`src/content/resume.ts`](./src/content/resume.ts) and the chrome strings in [`src/content/ui.ts`](./src/content/ui.ts).

```bash
$EDITOR src/content/resume.ts

make resumes      # regenerate the global PDF + DOCX
make deploy       # build + deploy to Cloudflare Pages
```

For **per-company tailoring** (a tailored brochure URL like `/anthropic`), see the next section.

---

## Variants — per-company tailored brochures

The repo supports **dispatch URLs**: tailored versions of the résumé living at `resume.lalalimited.com/<slug>` (e.g., `/anthropic`). Each variant is a small TypeScript file that overrides only the fields that need retuning — hero copy, outcome ordering, optional "hello card" addressed to the company. Career history and the rest fall through from base.

**Adding a new variant** takes 15–30 minutes:

```bash
cp src/content/variants/_template.ts src/content/variants/microsoft.ts

# 1. Fill in slug, company, hello, and any resume overrides
# 2. Register the variant in src/content/variants/index.ts
$EDITOR src/content/variants/microsoft.ts
$EDITOR src/content/variants/index.ts

make resumes-all   # regenerate every variant's PDF + DOCX
make deploy
```

**What you can override:** anything in `RESUME` except `experience` and `background` (career history is fact, not pitch). Arrays (impact, tech, etc.) are replaced wholesale; nested objects merge by key. TypeScript catches typo'd field names at compile time.

**The dispatch model:** variant URLs are not advertised. They get `<meta robots noindex,nofollow>` injected automatically, an auto-generated `Disallow:` line in `robots.txt`, and they're excluded from `sitemap.xml`. The recruiter you sent the link to is the only one who'll find it.

**Build commands:**

```bash
make resumes-all                                # all variants + global
make resume-pdf-slug   SLUG=microsoft           # one variant's PDF only
make resume-docx-slug  SLUG=microsoft           # one variant's DOCX only
make resumes                                    # global only (existing flow)
```

**Retiring a variant:** set `archived: true` in the variant file. The slug 404s and stops emitting artifacts. The file stays in the repo as a record.

---

## Project layout

```
living-resume/
├── functions/
│   └── api/
│       └── contact.ts             Cloudflare Pages Function — contact-form mailer
├── public/                         Static assets (deployed as-is)
│   ├── leif-taylor-resume-2026-05.pdf    Generated GLOBAL PDF
│   ├── leif-taylor-resume-2026-05.docx   Generated GLOBAL DOCX
│   ├── <slug>/                    Per-variant artifacts (PDF, DOCX, og-image.png)
│   ├── og-image.png / .svg        OG image (link previews) — SVG is now a template
│   ├── llms.txt                   LLM-crawler-friendly summary
│   └── favicon.svg                (robots.txt is generated to dist/ at build time)
├── scripts/
│   ├── generate-pdf.ts             Puppeteer driver: loops over [base, ...variants],
│   │                               navigates to each print route, waits for fonts,
│   │                               page.pdf() → public/[<slug>/]leif-taylor-resume-*.pdf
│   ├── generate-docx.ts            docx-package builder: loops over [base, ...variants]
│   │                               and emits per-variant ATS-friendly Word documents
│   ├── build-og-image.ts           Per-variant SVG template substitution → PNG (sharp)
│   ├── build-sitemap.ts            sitemap.xml builder (variant-blind)
│   ├── build-robots.ts             robots.txt with auto-Disallow per variant slug
│   └── prerender-*.mjs             Node ESM loader helpers for prerender.ts
├── src/
│   ├── App.tsx                     Routes: / (global), /:slug (variants), /print/resume, /:slug/print/resume, * (NotFound)
│   ├── main.tsx                    Hydration + StrictMode wrapper
│   ├── components/                 Site UI components (read content via useResume() context)
│   ├── content/
│   │   ├── resume.ts               ★ Base RESUME — single source of truth for global content
│   │   ├── ui.ts                   UI string surface (CTAs, modal/sheet copy, footer chrome)
│   │   ├── types.ts                Resume / UI / Variant / Hello / DeepPartial type aliases
│   │   ├── content-utils.ts        Shared helpers (isPrimaryEmployment, URL labelers, title-case)
│   │   ├── resolve-variant.ts      Deep-merge resolver: slug → resolved Resume + UI + hello
│   │   ├── resume-context.ts       React context + useResume() hook
│   │   └── variants/
│   │       ├── index.ts            Variant registry
│   │       ├── _template.ts        Copy this when adding a new variant
│   │       └── <slug>.ts           Per-company override files (e.g., anthropic.ts)
│   ├── lib/
│   │   └── schema.ts               schema.org Person JSON-LD builder
│   ├── pages/
│   │   ├── HomePage.tsx            Public site composition (variant-aware)
│   │   └── NotFound.tsx            Unknown-slug fallback
│   ├── print/
│   │   ├── ResumePrint.tsx         PDF-shaped layout (Puppeteer renders this)
│   │   └── ResumePrint.css
│   └── styles/
│       ├── globals.css             Tokens + base + reset
│       └── print.css               Print-specific overrides
├── prerender.ts                    SSRs every route in [/, /:slug, /print/resume, /:slug/print/resume]
├── index.html                      Vite entry point
├── Makefile                        Operator ergonomics (run `make help`)
├── wrangler.toml                   Cloudflare Pages deploy config
└── package.json
```

---

## Common tasks

```bash
make help              # discover everything below

make dev               # vite dev server on :5173
make typecheck         # tsc --noEmit
make lint              # eslint --max-warnings 0
make build             # full production build (vite + prerender + sitemap + og-image)
make preview           # serve dist/ on :4173

make resume-pdf        # GLOBAL PDF only (full build + Puppeteer)
make resume-docx       # GLOBAL DOCX only (~1s, no build needed)
make resumes           # GLOBAL PDF + DOCX
make resumes-all       # ALL variants + global, PDF + DOCX

make resume-pdf-slug   SLUG=<slug>   # one variant's PDF
make resume-docx-slug  SLUG=<slug>   # one variant's DOCX

make deploy            # build + wrangler pages deploy
make smoke             # ping the live URLs

make clean             # rm dist/ + tsbuildinfo
```

---

## Architecture notes

A few things in this repo that are worth a closer look:

### One data source, many formats and many variants

`src/content/resume.ts` exports a typed `RESUME` object that's the canonical content for every surface. Every component reads it via `useResume()`; the PDF and DOCX builders read it via `resolveVariant()`. There is no parallel content file for the PDF, DOCX, or any variant — diverging the formats is *prevented by construction*, not by discipline.

Per-company variants live in `src/content/variants/<slug>.ts` and override only the fields that differ. A resolver (`src/content/resolve-variant.ts`) deep-merges each variant onto the base at render time, and `<slug>` flows through React Router so the same components render the variant's data without knowing the slug exists.

### Prerendering

Both the home route (`/`) and the print route (`/print/resume`) are server-rendered to static HTML at build time. The home page hydrates client-side after load; the print page is captured by Puppeteer before any JS would run. The print route also injects a `noindex` meta tag and is `Disallow:`d in `robots.txt` so it doesn't show up in search.

### PDF determinism

Puppeteer launches the bundled Chromium so the same input produces the same PDF byte-for-byte across machines. Fonts are loaded from Google Fonts and explicitly waited on (`document.fonts.ready` plus a small safety pad) before `page.pdf()`. Margin, page size, and break behavior are all driven by CSS via `preferCSSPageSize: true`.

### DOCX is built from data, not from the PDF

A common pattern is to convert PDF → DOCX, which produces a mess of positioned text frames. This repo doesn't do that. The DOCX builder constructs a clean Word document from `RESUME` directly using [`docx`](https://docx.js.org/) — real `Heading1` / `Heading2` styles, real numbered bulleted lists, dates right-aligned via tab stops (no tables), live hyperlinks. ATS scanners that look for canonical Word structure see what they expect.

### The contact form

`POST /api/contact` is a single Pages Function ([`functions/api/contact.ts`](./functions/api/contact.ts)) that:

1. Method-gates (POST only)
2. Body-size-gates (≤ 8 KB)
3. JSON-parses
4. Honeypot-silent-200s if the bot tripped the trap
5. Verifies the Turnstile token against the secret
6. Hand-rolled validation (no Zod — too heavy for one route)
7. Per-IP rate-limits (5/hour) via the Cache API (no KV namespace required)
8. Forwards to Mailgun with the visitor's email as `Reply-To`

Secrets are set via `wrangler pages secret put NAME --project-name leif-taylor-resume`. The required ones are `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `NOTIFY_TO`, and `TURNSTILE_SECRET`.

### Single column, ATS-friendly throughout

The PDF, the DOCX, and the website are all single-column for the body content. No multi-column flow inside the toolkit (a phrase like *"secrets management"* would break across columns and fragment ATS keyword extraction). Section headers are real `<h2>` elements with `text-transform: uppercase` for visual treatment but no `letter-spacing` (the ATS guide explicitly warns about that). Standard symbols only — middle-dots and em-dashes for separators, plain Unicode arrows where they're meaningful content (not for decoration).

---

## Deployment

```bash
nvm use 24
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
make deploy
```

The deploy uploads `dist/` to Cloudflare Pages under the `leif-taylor-resume` project. Custom domain is `resume.lalalimited.com`, with the CNAME record managed in the Cloudflare dashboard.

---

## License

The **code** in this repository is licensed under [MIT](./LICENSE) — fork it, adapt it, use it for your own résumé. The **content** (prose, professional history, contact information) belongs to Leif Taylor and is not licensed for reuse. Take the patterns, leave the words.

---

## Acknowledgments

This entire repository — design, implementation, deployment, this README — was built end-to-end with [Claude Code](https://claude.com/claude-code) as the primary authoring tool. The decision to make it public is the meta-flex of the résumé itself: the agentic-delivery thesis isn't argued on the page, it's *demonstrated* by the page.

The typography stack (Fraunces · Geist · JetBrains Mono) is open-licensed via Google Fonts. The contact-mailer pattern is borrowed from a sister project and adapted for this site.
