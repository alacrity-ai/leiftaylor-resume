.PHONY: help install dev preview build prerender resume-pdf resume-docx resumes typecheck lint clean \
        deploy deploy-dev smoke logs

# ── Wrangler authentication ────────────────────────────────
# `wrangler login` doesn't work on a headless / WSL terminal. Export
# your Cloudflare credentials in your shell:
#
#   export CLOUDFLARE_API_TOKEN=<from secrets.md>
#   export CLOUDFLARE_ACCOUNT_ID=<from secrets.md>
#
# Always run `nvm use 24` before any of these targets.

PROJECT      := leif-taylor-resume
PROD_DOMAIN  := resume.lalalimited.com
PUBLIC_URL   := https://$(PROD_DOMAIN)
PREVIEW_URL  := https://leif-taylor-resume.pages.dev

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Setup ──────────────────────────────────────────────────

install: ## Install npm dependencies
	npm install

# ── Local development ──────────────────────────────────────

dev: ## Start Vite dev server on :5173
	npm run dev

preview: build ## Build, then serve dist/ on :4173
	npx vite preview

# ── Build ──────────────────────────────────────────────────

build: ## Full production build (og + vite + prerender + sitemap)
	npm run build

prerender: ## Re-run prerender against an existing dist/ (skips og-image)
	npm run build:fast

resume-pdf: ## Regenerate public/leif-taylor-resume-2026-05.pdf via Puppeteer (full build first)
	npm run resume-pdf
	@echo "  → public/leif-taylor-resume-2026-05.pdf updated"
	@echo "  → run 'make deploy' to publish"

resume-docx: ## Regenerate public/leif-taylor-resume-2026-05.docx from RESUME data (no build needed)
	npm run resume-docx
	@echo "  → public/leif-taylor-resume-2026-05.docx updated"
	@echo "  → run 'make deploy' to publish"

resumes: ## Regenerate both PDF and DOCX
	npm run resumes
	@echo "  → both résumé files updated; run 'make deploy' to publish"

# ── Quality ────────────────────────────────────────────────

typecheck: ## tsc --noEmit
	npm run typecheck

lint: ## ESLint with --max-warnings 0
	npm run lint

# ── Deploy ─────────────────────────────────────────────────

deploy: build ## Build + deploy to production (main branch)
	npx wrangler pages deploy dist --project-name $(PROJECT) --branch main --commit-dirty=true

deploy-dev: build ## Build + deploy to a non-prod preview branch
	npx wrangler pages deploy dist --project-name $(PROJECT) --branch dev --commit-dirty=true

# ── Smoke ──────────────────────────────────────────────────

smoke: ## Hit the live site for the basic surfaces; reports HTTP codes
	@echo "── $(PUBLIC_URL) ──"
	@for path in / /robots.txt /llms.txt /sitemap.xml /leif-taylor-resume-2026-05.pdf /og-image.png /favicon.svg; do \
		code=$$(curl -ksSL -o /dev/null -w "%{http_code}" $(PUBLIC_URL)$$path); \
		printf "  %-42s %s\n" "$$path" "$$code"; \
	done
	@echo "── $(PREVIEW_URL) ──"
	@for path in / /robots.txt /llms.txt /sitemap.xml /leif-taylor-resume-2026-05.pdf /og-image.png /favicon.svg; do \
		code=$$(curl -ksSL -o /dev/null -w "%{http_code}" $(PREVIEW_URL)$$path); \
		printf "  %-42s %s\n" "$$path" "$$code"; \
	done

logs: ## Tail the Pages deployment log
	npx wrangler pages deployment tail --project-name $(PROJECT)

# ── Housekeeping ───────────────────────────────────────────

clean: ## Remove build outputs and tsbuild caches (keeps node_modules)
	rm -rf dist *.tsbuildinfo
