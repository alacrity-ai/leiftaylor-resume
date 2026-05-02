/**
 * Generates the PDF résumé from the prerendered /print/resume route.
 *
 * Pipeline:
 *   1. Confirm dist/print/resume/index.html exists (npm run build first).
 *   2. Boot a tiny in-process static server pointing at dist/.
 *   3. Launch Puppeteer, navigate to the print route.
 *   4. Wait for fonts (document.fonts.ready) + small safety pad.
 *   5. Sanity-check the rendered DOM for required ATS keywords.
 *   6. page.pdf() to public/leif-taylor-resume-2026-05.pdf.
 *   7. Tear down server + browser.
 */
import { createServer, type Server } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'leif-taylor-resume-2026-05.pdf');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
};

function startServer(root: string): Promise<{
  url: string;
  close: () => Promise<void>;
}> {
  return new Promise((resolve, reject) => {
    const server: Server = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent((req.url ?? '/').split('?')[0]);
        if (p.endsWith('/')) p += 'index.html';
        const full = join(root, p);
        if (!full.startsWith(root)) {
          res.writeHead(403);
          res.end('forbidden');
          return;
        }
        let target = full;
        try {
          const s = await stat(full);
          if (s.isDirectory()) {
            target = join(full, 'index.html');
          }
        } catch {
          // try fall through — could be a route that needs index.html
          target = join(full, 'index.html');
        }
        try {
          const data = await readFile(target);
          const ext = extname(target).toLowerCase();
          res.writeHead(200, {
            'content-type': MIME[ext] ?? 'application/octet-stream',
            'cache-control': 'no-store',
          });
          res.end(data);
        } catch {
          res.writeHead(404);
          res.end('not found');
        }
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        resolve({
          url: `http://127.0.0.1:${addr.port}`,
          close: () =>
            new Promise<void>((r) => {
              server.close(() => r());
            }),
        });
      } else {
        reject(new Error('server.address() did not return an AddressInfo'));
      }
    });
  });
}

async function main() {
  const printIndex = join(DIST, 'print', 'resume', 'index.html');
  if (!existsSync(printIndex)) {
    console.error(
      `✗ ${printIndex} missing. Run \`npm run build\` first to generate the prerendered HTML.`,
    );
    process.exit(1);
  }

  console.log('  → starting static server');
  const { url, close: closeServer } = await startServer(DIST);
  console.log(`  → serving ${DIST} at ${url}`);

  console.log('  → launching Chromium');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    page.on('pageerror', (err) => console.error('  page error:', err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.error('  console error:', msg.text());
    });

    const target = `${url}/print/resume`;
    console.log(`  → navigating to ${target}`);
    await page.goto(target, { waitUntil: 'networkidle0', timeout: 60_000 });

    console.log('  → waiting for fonts');
    await page.evaluate(async () => {
      // FontFaceSet API — runs inside the browser context, so `document`
      // resolves at runtime even though node's tsconfig has no DOM lib.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (globalThis as any).document.fonts.ready;
    });
    await new Promise((r) => setTimeout(r, 400));

    console.log('  → ATS keyword sanity check');
    // textContent is what real ATS parsers see — raw markup text, not the
    // CSS-transformed rendered text. (innerText would return UPPERCASE for
    // anything styled with text-transform: uppercase, which would make us
    // miss most of the keywords below.)
    const text: string = await page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (globalThis as any).document.body.textContent as string;
    });
    const required = [
      // Identity / positioning
      'AI-Native Principal Engineer',
      'Product-to-Production Architect',
      'Greater Boston Area',
      'leif@alacrity.ai',
      // Section heads
      'How I Work',
      'Outcomes',
      'Experience',
      'Toolkit',
      // Roles + companies
      'ConnectBase',
      'Principal Engineer',
      'Director of DevOps',
      'Mobile Heartbeat',
      'Actifio',
      'Chemveric',
      'Alacrity Solutions',
      'Imprint.live',
      'Open Interpreter',
      // Outcome anchors
      '$600K',
      '0 → 1',
      'CPQ',
      'RFQ',
      'marketplace',
      'AI matching',
      'AI moderation',
      // High-value ATS keywords from the new toolkit
      'OpenAI',
      'Anthropic',
      'LangChain',
      'LangGraph',
      'MCP',
      'RAG',
      'Pinecone',
      'pgvector',
      'NestJS',
      'FastAPI',
      'Spring Boot',
      'Kubernetes',
      'Terraform',
      'GitHub Actions',
      'Kafka',
      'Snowflake',
      'PostgreSQL',
      'OpenTelemetry',
      'OAuth2',
      'OWASP',
      'Playwright',
    ];
    const missing = required.filter((k) => !text.includes(k));
    if (missing.length > 0) {
      console.error('  ✗ missing keywords:', missing);
      process.exit(1);
    }
    console.log(`  ✓ all ${required.length} ATS keywords present`);

    console.log(`  → rendering PDF to ${OUT}`);
    await page.pdf({
      path: OUT,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0.5in',
        bottom: '0.5in',
        left: '0.55in',
        right: '0.55in',
      },
      displayHeaderFooter: false,
    });

    const { size } = await stat(OUT);
    console.log(`✓ wrote ${OUT} (${(size / 1024).toFixed(1)} KB)`);
  } finally {
    await browser.close();
    await closeServer();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
