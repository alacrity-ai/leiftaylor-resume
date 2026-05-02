# Living Resume — `resume.lalalimited.com`

Personal résumé brochure for Leif Taylor. Single-page React + Vite, prerendered at build time, deployed to Cloudflare Pages.

## Stack

- Node 24, Vite 6, React 19, TypeScript 5
- Plain CSS with `@layer` tokens (no Tailwind here — single-page brochure with bespoke type rhythm)
- Fraunces (display) + Geist (body) + JetBrains Mono — all Google Fonts
- Cloudflare Pages, deployed via `wrangler pages deploy`

## Develop

```bash
nvm use 24
make install
make dev          # http://localhost:5173
```

## Edit content

**One file:** `src/content/resume.ts`. Every string on the page lives there.

To update the résumé:

1. Edit `src/content/resume.ts`
2. Optionally bump `RESUME.meta.lastReviewed` (shown in footer)
3. If the PDF changed, drop the new file at `public/leif-taylor-resume-YYYY-MM.pdf` and update `RESUME.meta.pdfHref`
4. `make build && make deploy`

## Build

```bash
make typecheck    # tsc --noEmit
make build        # tsc -b + og-image + vite build + prerender + sitemap
make preview      # serve dist/ on :4173
```

The build pipeline:

1. `tsx scripts/build-og-image.ts` — renders `public/og-image.svg` → `public/og-image.png` via sharp
2. `vite build` — bundles + copies `public/*` to `dist/`
3. `prerender.ts` — server-renders `<App/>` and injects into `dist/index.html`, plus a `<script type="application/ld+json">` Person block
4. `scripts/build-sitemap.ts` — writes `dist/sitemap.xml`

## Deploy

```bash
nvm use 24
export CLOUDFLARE_API_TOKEN=...        # from secrets.md
export CLOUDFLARE_ACCOUNT_ID=...
make deploy                            # production
```

The custom-domain CNAME (`resume.lalalimited.com → leif-taylor-resume.pages.dev`) and the cert provisioning are managed in Cloudflare. They're already set up — you only need to deploy.

## Layout

```
docs/                  Design and implementation specs (read these first)
pdf/                   User-supplied master PDF (not deployed)
public/                Static assets that get copied to dist/ at build time
src/
├── content/resume.ts  Single source of truth for every string
├── components/        One component per section (Hero, Impact, Profile, …)
├── lib/schema.ts      schema.org Person JSON-LD builder
└── styles/            globals.css (tokens, base, motion) + print.css
prerender.ts           Single-route prerender script
scripts/               build-og-image, build-sitemap, prerender loaders
```

## Smoke

```bash
make smoke             # hits / /robots.txt /llms.txt /sitemap.xml etc
```
