/**
 * Generates an ATS-friendly .docx résumé from the same RESUME data the
 * website and PDF use. Output: public/leif-taylor-resume-2026-05.docx
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
 */
import { writeFileSync } from 'node:fs';
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
import { RESUME } from '../src/content/resume';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'public', 'leif-taylor-resume-2026-05.docx');

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

// ─── Helpers ─────────────────────────────────────────────────

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

/** A line with bold lead-in followed by descriptive text. */
function leadIn(lead: string, rest: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    children: [
      new TextRun({ text: lead, bold: true, size: SZ_BODY, font: FONT_BODY, color: COLOR_INK }),
      new TextRun({ text: ` — ${rest}`, size: SZ_BODY, font: FONT_BODY, color: COLOR_INK }),
    ],
  });
}

/** Company + dates on one line, with dates right-aligned via tab stop. */
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

/** Role title in mono small caps with optional sub-text and inner dates. */
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

// ─── Header block ────────────────────────────────────────────

function buildHeader(): Paragraph[] {
  const m = RESUME.meta;
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: 'Leif Taylor',
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
          text: 'AI-NATIVE PRINCIPAL ENGINEER · PRODUCT-TO-PRODUCTION ARCHITECT',
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
        new TextRun({ text: 'Greater Boston Area  ·  ', size: SZ_BODY_SMALL, font: FONT_BODY, color: COLOR_INK }),
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
              text: 'linkedin.com/in/leiftaylor',
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
              text: 'resume.lalalimited.com',
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

// ─── Thesis ──────────────────────────────────────────────────

function buildThesis(): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 120, after: 220, line: 320 },
      children: [
        new TextRun({
          text: RESUME.hero.tagline,
          italics: true,
          size: SZ_THESIS,
          font: FONT_BODY,
          color: COLOR_INK,
        }),
      ],
    }),
  ];
}

// ─── How I Work ──────────────────────────────────────────────

function buildHowIWork(): Paragraph[] {
  const out: Paragraph[] = [sectionHead('How I Work')];
  for (const para of RESUME.operatingModel.paragraphs) {
    out.push(body(para));
  }
  return out;
}

// ─── Outcomes ────────────────────────────────────────────────

function buildOutcomes(): Paragraph[] {
  const out: Paragraph[] = [sectionHead('Outcomes')];
  for (const o of RESUME.impact) {
    out.push(leadIn(o.value, o.label));
  }
  return out;
}

// ─── Experience ──────────────────────────────────────────────

interface ExpEntry {
  range: string;
  cards: Array<{
    company: string;
    role: string;
    badge?: string;
    dates?: string;
    promotedFrom?: string;
    bullets?: string[];
    description?: string;
    tags?: string[];
    link?: { href: string; label: string };
  }>;
}

function isPrimaryEmployment(e: ExpEntry): boolean {
  return !!e.cards[0]?.bullets;
}

function buildExperience(): Paragraph[] {
  const out: Paragraph[] = [sectionHead('Experience')];
  const primary = (RESUME.experience as ExpEntry[]).filter(isPrimaryEmployment);

  for (const entry of primary) {
    const firstCard = entry.cards[0];
    out.push(companyDateLine(firstCard.company, entry.range));

    for (let i = 0; i < entry.cards.length; i++) {
      const card = entry.cards[i];
      // Connector for promoted-into card (idx > 0)
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

// ─── Consulting & Fractional ─────────────────────────────────

function buildConsulting(): Paragraph[] {
  const out: Paragraph[] = [sectionHead('Consulting & Fractional')];
  const consulting = (RESUME.experience as ExpEntry[]).filter((e) => !isPrimaryEmployment(e));

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

// ─── Toolkit ────────────────────────────────────────────────

function buildToolkit(): Paragraph[] {
  const out: Paragraph[] = [sectionHead('Toolkit')];
  for (const bucket of RESUME.tech) {
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

const doc = new Document({
  creator: 'Leif Taylor',
  title: 'Leif Taylor — Résumé',
  description: 'Résumé of Leif Taylor, AI-Native Principal Engineer & Product-to-Production Architect',
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
          margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5in (1in = 1440 twip)
        },
      },
      children: [
        ...buildHeader(),
        ...buildThesis(),
        ...buildHowIWork(),
        ...buildOutcomes(),
        ...buildExperience(),
        ...buildConsulting(),
        ...buildToolkit(),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT, buffer);
console.log(`✓ wrote ${OUT} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
