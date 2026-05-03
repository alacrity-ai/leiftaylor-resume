/**
 * Prerender script — produces static HTML for every route the site
 * exposes, looping over `[null, ...VARIANT_SLUGS]` so each variant gets
 * its own home + print prerendered files with per-variant head
 * metadata. Variant routes are emitted with `noindex,nofollow` per the
 * dispatch-URL model (see DATA_DRIVEN_APPROACH.md §6).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createElement } from 'react';

import App from './src/App';
import { resolveVariant } from './src/content/resolve-variant';
import { VARIANT_SLUGS } from './src/content/variants';
import { personSchema } from './src/lib/schema';
import type { ResolvedVariant } from './src/content/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

interface Route {
  path: string;
  outFile: string;
  noindex: boolean;
  schema: boolean;
  meta: RouteMeta;
  resolved: ResolvedVariant;
}

/** Build the meta block for a route given a resolved variant bundle.
 *  `path` is the URL path the route serves (`/`, `/anthropic`, etc.). */
function metaForRoute(resolved: ResolvedVariant, path: string, isPrint: boolean): RouteMeta {
  const m = resolved.resume.meta;
  const longTitle = isPrint
    ? `${m.name} — Résumé${resolved.company ? ` (${resolved.company})` : ''}`
    : `${m.name} — ${m.jobTitle}`;
  const shortTitle = `${m.name} — ${m.titleStack.split(/\s*·\s*/)[0]}`;
  // OG image lives at `/og-image.png` (global) or `/<slug>/og-image.png` (variant).
  const ogImagePath = resolved.slug ? `/${resolved.slug}/og-image.png` : `/og-image.png`;
  const ogImage = `${m.siteUrl}${ogImagePath}`;
  const canonical = `${m.siteUrl}${path}`;
  return {
    title: longTitle,
    description: m.jobDescription,
    canonical,
    ogTitle: shortTitle,
    ogDescription: m.jobDescription,
    ogUrl: canonical,
    ogImage,
    ogType: 'profile',
    twitterCard: 'summary_large_image',
    twitterTitle: shortTitle,
    twitterDescription: m.shortDescription,
    twitterImage: ogImage,
  };
}

/** All routes the build emits — global + variants × {home, print}. */
function buildRoutes(): Route[] {
  const routes: Route[] = [];
  const slugs: (string | null)[] = [null, ...VARIANT_SLUGS];
  for (const slug of slugs) {
    const resolved = resolveVariant(slug);
    if (resolved === null) {
      throw new Error(
        `resolveVariant returned null for registered slug ${JSON.stringify(slug)} — ` +
          'this should not happen for VARIANT_SLUGS entries.',
      );
    }
    const homePath = slug ? `/${slug}` : '/';
    const printPath = slug ? `/${slug}/print/resume` : '/print/resume';
    const homeOut = slug ? `${slug}/index.html` : 'index.html';
    const printOut = slug ? `${slug}/print/resume/index.html` : 'print/resume/index.html';
    routes.push({
      path: homePath,
      outFile: homeOut,
      noindex: slug !== null, // variants are dispatch URLs
      schema: slug === null, // only the global emits Person JSON-LD
      meta: metaForRoute(resolved, slug ? `${homePath}` : '/', false),
      resolved,
    });
    routes.push({
      path: printPath,
      outFile: printOut,
      noindex: true,
      schema: false,
      meta: metaForRoute(resolved, printPath, true),
      resolved,
    });
  }
  return routes;
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceMetaContent(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const re = new RegExp(
    `(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`,
    'i',
  );
  return html.replace(re, `$1${escapeAttr(value)}$2`);
}

function applyMeta(html: string, m: RouteMeta): string {
  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(m.title)}</title>`);
  out = replaceMetaContent(out, 'name', 'description', m.description);
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(m.canonical)}" />`,
  );
  out = replaceMetaContent(out, 'property', 'og:title', m.ogTitle);
  out = replaceMetaContent(out, 'property', 'og:description', m.ogDescription);
  out = replaceMetaContent(out, 'property', 'og:url', m.ogUrl);
  out = replaceMetaContent(out, 'property', 'og:type', m.ogType);
  out = replaceMetaContent(out, 'property', 'og:image', m.ogImage);
  out = replaceMetaContent(out, 'name', 'twitter:card', m.twitterCard);
  out = replaceMetaContent(out, 'name', 'twitter:title', m.twitterTitle);
  out = replaceMetaContent(out, 'name', 'twitter:description', m.twitterDescription);
  out = replaceMetaContent(out, 'name', 'twitter:image', m.twitterImage);
  return out;
}

async function main() {
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');
  const routes = buildRoutes();

  for (const route of routes) {
    const appHtml = renderToString(
      createElement(StaticRouter, { location: route.path }, createElement(App)),
    );

    let html = applyMeta(template, route.meta);

    const headInjections: string[] = [];
    if (route.noindex) {
      headInjections.push(`<meta name="robots" content="noindex,nofollow" />`);
    }
    if (route.schema) {
      const schema = JSON.stringify(personSchema(route.resolved.resume.meta));
      headInjections.push(`<script type="application/ld+json">${schema}</script>`);
    }

    if (headInjections.length > 0) {
      html = html.replace(
        '</head>',
        `    ${headInjections.join('\n    ')}\n  </head>`,
      );
    }

    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );

    const outPath = join(DIST, route.outFile);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    console.log(`✓ prerendered ${route.path} → ${route.outFile} (${(html.length / 1024).toFixed(1)} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
