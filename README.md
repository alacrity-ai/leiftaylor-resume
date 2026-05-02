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

Every string on every surface is in **one file**: [`src/content/resume.ts`](./src/content/resume.ts).

```bash
$EDITOR src/content/resume.ts

make resumes      # regenerate PDF + DOCX (≈10s for both)
make deploy       # build + deploy to Cloudflare Pages
```

That's the complete update loop.

---

## Project layout

```
living-resume/
├── functions/
│   └── api/
│       └── contact.ts             Cloudflare Pages Function — contact-form mailer
├── public/                         Static assets (deployed as-is)
│   ├── leif-taylor-resume-2026-05.pdf    Generated PDF
│   ├── leif-taylor-resume-2026-05.docx   Generated DOCX
│   ├── og-image.png / .svg        OG image (link previews)
│   ├── llms.txt                   LLM-crawler-friendly summary
│   ├── robots.txt
│   └── favicon.svg
├── scripts/
│   ├── generate-pdf.ts             Puppeteer driver: spins up a static server,
│   │                               navigates to /print/resume, waits for fonts,
│   │                               page.pdf() → public/leif-taylor-resume-*.pdf
│   ├── generate-docx.ts            docx-package builder: reads RESUME → emits
│   │                               an ATS-friendly Word document
│   ├── build-og-image.ts           SVG → PNG OG image generation (sharp)
│   ├── build-sitemap.ts            sitemap.xml builder
│   └── prerender-*.mjs             Node ESM loader helpers for prerender.ts
├── src/
│   ├── App.tsx                     Routes: / (HomePage), /print/resume (ResumePrint)
│   ├── main.tsx                    Hydration + StrictMode wrapper
│   ├── components/                 Site UI components
│   ├── content/
│   │   └── resume.ts               ★ Single source of truth for all content
│   ├── lib/
│   │   └── schema.ts               schema.org Person JSON-LD builder
│   ├── pages/
│   │   └── HomePage.tsx            Public site composition
│   ├── print/
│   │   ├── ResumePrint.tsx         PDF-shaped layout (Puppeteer renders this)
│   │   └── ResumePrint.css
│   └── styles/
│       ├── globals.css             Tokens + base + reset
│       └── print.css               Print-specific overrides
├── prerender.ts                    Server-side render of both routes to static HTML
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

make resume-pdf        # PDF only (full build + Puppeteer)
make resume-docx       # DOCX only (~1s, no build needed)
make resumes           # both formats

make deploy            # build + wrangler pages deploy
make smoke             # ping the live URLs

make clean             # rm dist/ + tsbuildinfo
```

---

## Architecture notes

A few things in this repo that are worth a closer look:

### One data source, three formats

`src/content/resume.ts` exports a typed `RESUME` object that's the canonical content for every surface. The website's React components read from it; the PDF route's React tree reads from it; the DOCX builder reads from it. There is no parallel content file for the PDF or DOCX — diverging the formats is *prevented by construction*, not by discipline.

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
