/**
 * Prerender script — produces static index.html files for both the home
 * route and the print route. The print route gets a noindex meta and is
 * served only for the Puppeteer-driven PDF generation pipeline.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createElement } from 'react';

import App from './src/App';
import { RESUME } from './src/content/resume';
import { personSchema } from './src/lib/schema';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

interface Route {
  path: string;
  outFile: string;
  noindex: boolean;
  schema: boolean;
  title?: string;
}

const ROUTES: Route[] = [
  { path: '/', outFile: 'index.html', noindex: false, schema: true },
  {
    path: '/print/resume',
    outFile: 'print/resume/index.html',
    noindex: true,
    schema: false,
    title: 'Leif Taylor — Résumé',
  },
];

async function main() {
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');

  for (const route of ROUTES) {
    const appHtml = renderToString(
      createElement(StaticRouter, { location: route.path }, createElement(App)),
    );

    let html = template;

    if (route.title) {
      html = html.replace(/<title>[^<]+<\/title>/, `<title>${route.title}</title>`);
    }

    const headInjections: string[] = [];
    if (route.noindex) {
      headInjections.push(`<meta name="robots" content="noindex,nofollow" />`);
    }
    if (route.schema) {
      const schema = JSON.stringify(personSchema(RESUME.meta));
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
