/**
 * Generates ATS-friendly .docx résumés from the same RESUME data the
 * website and PDF use. Loops over `[null, ...VARIANT_SLUGS]` so each
 * registered variant gets its own DOCX at the variant-aware path.
 *
 * ATS-friendliness rules followed (per docs/ATS_FEEDBACK.md):
 *  - Single column body, no tables for layout
 *  - Standard fonts (Calibri 11pt)
 *  - Real Heading styles for section heads
 *  - Real bulleted lists for accomplishments
 *  - Section headers in ALL CAPS
 *  - Live hyperlinks for email / LinkedIn / site / repo
 *  - No accented characters in the visible text (we use plain dashes etc.)
 *  - Dates right-aligned via tab stops, not tables
 *
 * Single-variant mode: `RESUME_SLUG=<slug>` builds only that variant.
 * `RESUME_SLUG=base` builds only the global. Otherwise all are built.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from 'docx';

import { resolveVariant } from '../src/content/resolve-variant';
import { VARIANT_SLUGS } from '../src/content/variants';
import {
  isPrimaryEmployment,
  linkedinLabel,
  siteHostLabel,
  titleCaseLabel,
} from '../src/content/content-utils';
import type { Resume, UI } from '../src/content/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const FONT_BODY = 'Calibri';
const FONT_HEADING = 'Calibri';

const COLOR_INK = '14171A';
const COLOR_INK_MUTED = '6A6F77';
const COLOR_INK_FAINT = '95999F';
const COLOR_ACCENT = '7A1F2B';

// docx package uses half-points for size. So size: 22 = 11pt.
const SZ_NAME = 44; // 22pt
const SZ_EYEBROW = 18; // 9pt
const SZ_BODY = 22; // 11pt
const SZ_BODY_SMALL = 20; // 10pt
const SZ_SECTION_HEAD = 22; // 11pt
const SZ_THESIS = 24; // 12pt
const SZ_DATE = 18; // 9pt

const TAB_RIGHT = TabStopPosition.MAX;

// ─── Paragraph builders (pure helpers — no global RESUME read) ──

function sectionHead(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: {
      bottom: {
        color: COLOR_ACCENT,
        space: 4,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: SZ_SECTION_HEAD,
        font: FONT_HEADING,
        color: COLOR_ACCENT,
      }),
    ],
  });
}

function body(text: string, opts?: { italic?: boolean; size?: number; color?: string; spaceAfter?: number }): Paragraph {
  return new Paragraph({
    spacing: { after: opts?.spaceAfter ?? 120, line: 300 },
    children: [
      new TextRun({
        text,
        italics: opts?.italic ?? false,
        size: opts?.size ?? SZ_BODY,
        font: FONT_BODY,
        color: opts?.color ?? COLOR_INK,
      }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    numbering: { reference: 'resume-bullets', level: 0 },
    spacing: { after: 60, line: 280 },
    children: [
      new TextRun({
        text,
        size: SZ_BODY_SMALL,
        font: FONT_BODY,
        color: COLOR_INK,
      }),
    ],
  });
}

function leadIn(lead: string, rest: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    children: [
      new TextRun({ text: lead, bold: true, size: SZ_BODY, font: FONT_BODY, color: COLOR_INK }),
      new TextRun({ text: ` — ${rest}`, size: SZ_BODY, font: FONT_BODY, color: COLOR_INK }),
    ],
  });
}

function companyDateLine(company: string, dates: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TAB_RIGHT }],
    spacing: { before: 200, after: 40 },
    children: [
      new TextRun({ text: company, bold: true, size: SZ_BODY, font: FONT_BODY, color: COLOR_INK }),
      new TextRun({ text: '\t', size: SZ_BODY }),
      new TextRun({ text: dates, size: SZ_DATE, font: FONT_BODY, color: COLOR_INK_FAINT }),
    ],
  });
}

function roleLine(role: string, sub?: string, innerDates?: string, badge?: string): Paragraph {
  const children: TextRun[] = [
    new TextRun({
      text: role.toUpperCase(),
      bold: true,
      size: SZ_BODY_SMALL,
      font: FONT_BODY,
      color: COLOR_ACCENT,
    }),
  ];
  if (badge) {
    children.push(
      new TextRun({
        text: `  [${badge}]`,
        bold: true,
        size: SZ_DATE,
        font: FONT_BODY,
        color: COLOR_ACCENT,
      }),
    );
  }
  if (innerDates) {
    children.push(
      new TextRun({
        text: `  ${innerDates}`,
        size: SZ_DATE,
        font: FONT_BODY,
        color: COLOR_INK_MUTED,
      }),
    );
  }
  if (sub) {
    children.push(
      new TextRun({
        text: `  ${sub}`,
        italics: true,
        size: SZ_DATE,
        font: FONT_BODY,
        color: COLOR_INK_MUTED,
      }),
    );
  }
  return new Paragraph({
    spacing: { after: 40, line: 280 },
    children,
  });
}

// ─── Section assemblers (take resume / ui as input) ──────────

function buildHeader(resume: Resume): Paragraph[] {
  const m = resume.meta;
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: m.name,
          bold: true,
          size: SZ_NAME,
          font: FONT_HEADING,
          color: COLOR_INK,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: m.titleStack.toUpperCase(),
          bold: true,
          size: SZ_EYEBROW,
          font: FONT_HEADING,
          color: COLOR_ACCENT,
          characterSpacing: 4,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: `${m.location}  ·  `, size: SZ_BODY_SMALL, font: FONT_BODY, color: COLOR_INK }),
        new ExternalHyperlink({
          link: `mailto:${m.email}`,
          children: [
            new TextRun({
              text: m.email,
              size: SZ_BODY_SMALL,
              font: FONT_BODY,
              color: COLOR_ACCENT,
              underline: {},
            }),
          ],
        }),
        new TextRun({ text: '  ·  ', size: SZ_BODY_SMALL, font: FONT_BODY, color: COLOR_INK }),
        new ExternalHyperlink({
          link: m.linkedin,
          children: [
            new TextRun({
              text: linkedinLabel(m.linkedin),
              size: SZ_BODY_SMALL,
              font: FONT_BODY,
              color: COLOR_ACCENT,
              underline: {},
            }),
          ],
        }),
        new TextRun({ text: '  ·  ', size: SZ_BODY_SMALL, font: FONT_BODY, color: COLOR_INK }),
        new ExternalHyperlink({
          link: m.siteUrl,
          children: [
            new TextRun({
              text: siteHostLabel(m.siteUrl),
              size: SZ_BODY_SMALL,
              font: FONT_BODY,
              color: COLOR_ACCENT,
              underline: {},
            }),
          ],
        }),
      ],
    }),
  ];
}

function buildThesis(resume: Resume): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 120, after: 220, line: 320 },
      children: [
        new TextRun({
          text: resume.hero.tagline,
          italics: true,
          size: SZ_THESIS,
          font: FONT_BODY,
          color: COLOR_INK,
        }),
      ],
    }),
  ];
}

function buildHowIWork(resume: Resume): Paragraph[] {
  const out: Paragraph[] = [sectionHead(titleCaseLabel(resume.sections.operatingModel.label))];
  for (const para of resume.operatingModel.paragraphs) {
    out.push(body(para));
  }
  return out;
}

function buildOutcomes(resume: Resume): Paragraph[] {
  const out: Paragraph[] = [sectionHead(resume.sections.impact.label)];
  for (const o of resume.impact) {
    out.push(leadIn(o.value, o.label));
  }
  return out;
}

function buildExperience(resume: Resume): Paragraph[] {
  const out: Paragraph[] = [sectionHead(resume.sections.experience.label)];
  const primary = resume.experience.filter(isPrimaryEmployment);

  for (const entry of primary) {
    const firstCard = entry.cards[0];
    out.push(companyDateLine(firstCard.company, entry.pdfRange ?? entry.range));

    for (let i = 0; i < entry.cards.length; i++) {
      const card = entry.cards[i];
      if (i > 0 && card.promotedFrom) {
        out.push(
          new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: `↑ ${card.promotedFrom}`,
                size: SZ_DATE,
                font: FONT_BODY,
                color: COLOR_ACCENT,
                italics: true,
              }),
            ],
          }),
        );
      }
      out.push(
        roleLine(
          card.role,
          i === 0 ? card.promotedFrom : undefined,
          card.dates,
          card.badge,
        ),
      );
      if (card.bullets) {
        for (const b of card.bullets) {
          out.push(bullet(b));
        }
      }
    }
  }
  return out;
}

function buildConsulting(resume: Resume, ui: UI): Paragraph[] {
  const out: Paragraph[] = [sectionHead(ui.print.consultingHeading)];
  const consulting = resume.experience.filter((e) => !isPrimaryEmployment(e));

  for (const entry of consulting) {
    const card = entry.cards[0];
    out.push(companyDateLine(`${card.company} — ${card.role}`, entry.range));
    if (card.description) {
      out.push(body(card.description, { size: SZ_BODY_SMALL, color: COLOR_INK_MUTED }));
    }
    if (card.link) {
      out.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new ExternalHyperlink({
              link: card.link.href,
              children: [
                new TextRun({
                  text: card.link.label,
                  size: SZ_DATE,
                  font: FONT_BODY,
                  color: COLOR_ACCENT,
                  underline: {},
                }),
              ],
            }),
          ],
        }),
      );
    }
  }
  return out;
}

function buildToolkit(resume: Resume): Paragraph[] {
  const out: Paragraph[] = [sectionHead(resume.sections.tech.label)];
  for (const bucket of resume.tech) {
    out.push(
      new Paragraph({
        spacing: { before: 160, after: 40 },
        children: [
          new TextRun({
            text: bucket.label.toUpperCase(),
            bold: true,
            size: SZ_BODY_SMALL,
            font: FONT_BODY,
            color: COLOR_INK_MUTED,
            characterSpacing: 4,
          }),
        ],
      }),
    );
    out.push(
      new Paragraph({
        spacing: { after: 80, line: 280 },
        children: [
          new TextRun({
            text: bucket.pills.join(' · '),
            size: SZ_BODY_SMALL,
            font: FONT_BODY,
            color: COLOR_INK,
          }),
        ],
      }),
    );
  }
  return out;
}

// ─── Document assembly ──────────────────────────────────────

function buildDocument(resume: Resume, ui: UI): Document {
  return new Document({
    creator: resume.meta.name,
    title: `${resume.meta.name} — Résumé`,
    description: `Résumé of ${resume.meta.name}, ${resume.meta.titleStack}`,
    styles: {
      default: {
        document: {
          run: { font: FONT_BODY, size: SZ_BODY, color: COLOR_INK },
          paragraph: { spacing: { line: 280 } },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: 'resume-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 360, hanging: 200 } },
                run: { color: COLOR_ACCENT },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children: [
          ...buildHeader(resume),
          ...buildThesis(resume),
          ...buildHowIWork(resume),
          ...buildOutcomes(resume),
          ...buildExperience(resume),
          ...buildConsulting(resume, ui),
          ...buildToolkit(resume),
        ],
      },
    ],
  });
}

async function generateForSlug(slug: string | null): Promise<void> {
  const resolved = resolveVariant(slug);
  if (resolved === null) {
    throw new Error(`resolveVariant returned null for ${JSON.stringify(slug)}`);
  }
  const out = join(ROOT, 'public', resolved.resume.meta.docxHref.replace(/^\//, ''));
  mkdirSync(dirname(out), { recursive: true });
  const doc = buildDocument(resolved.resume, resolved.ui);
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(out, buffer);
  console.log(`✓ [${slug ?? 'base'}] wrote ${out} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
}

async function main() {
  const env = process.env.RESUME_SLUG;
  let slugsToBuild: (string | null)[];
  if (env === undefined) {
    slugsToBuild = [null, ...VARIANT_SLUGS];
  } else if (env === 'base' || env === '') {
    slugsToBuild = [null];
  } else {
    if (!VARIANT_SLUGS.includes(env)) {
      console.error(
        `✗ RESUME_SLUG=${JSON.stringify(env)} is not a registered variant. ` +
          `Known variants: ${VARIANT_SLUGS.join(', ') || '(none)'}.`,
      );
      process.exit(1);
    }
    slugsToBuild = [env];
  }

  for (const slug of slugsToBuild) {
    await generateForSlug(slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
