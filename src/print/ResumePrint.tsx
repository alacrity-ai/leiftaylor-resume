/**
 * The PDF-shaped layout. Renders entirely from the same RESUME content
 * data the website uses, formatted for paper — single column, dense
 * typography, page-break-aware, ATS-parseable.
 *
 * Mounted at /print/resume (global) and /<slug>/print/resume (variants).
 * Driven by Puppeteer at build time to produce per-variant PDFs.
 */
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResumeContext, useResume } from '@/content/resume-context';
import { resolveVariant } from '@/content/resolve-variant';
import {
  isPrimaryEmployment,
  linkedinLabel,
  siteHostLabel,
  startYearFromDates,
  titleCaseLabel,
} from '@/content/content-utils';
import NotFound from '@/pages/NotFound';
import './ResumePrint.css';

export default function ResumePrint() {
  const { slug } = useParams();
  const resolved = resolveVariant(slug);
  if (resolved === null) return <NotFound />;
  return (
    <ResumeContext.Provider value={resolved}>
      <ResumePrintBody />
    </ResumeContext.Provider>
  );
}

function ResumePrintBody() {
  const { resume: RESUME, ui: UI } = useResume();
  const m = RESUME.meta;

  // Body class management — disables the website's paper texture and
  // hero stagger defaults so the print page renders clean white.
  useLayoutEffect(() => {
    document.body.classList.add('printing');
    document.title = `${m.name} — Résumé`;
    return () => {
      document.body.classList.remove('printing');
    };
  }, [m.name]);

  const primary = RESUME.experience.filter(isPrimaryEmployment);
  const consulting = RESUME.experience.filter((e) => !isPrimaryEmployment(e));

  return (
    <article className="resume-print">
      {/* ─── HEADER ───────────────────────────────────────── */}
      <header className="resume-print__header">
        <h1 className="resume-print__name">{m.name}</h1>
        <p className="resume-print__eyebrow">{m.titleStack}</p>
        <p className="resume-print__contact">
          <span>{m.location}</span>
          <span aria-hidden="true"> · </span>
          <a href={`mailto:${m.email}`}>{m.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={m.linkedin} target="_blank" rel="noreferrer">
            {linkedinLabel(m.linkedin)}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={m.siteUrl} target="_blank" rel="noreferrer">
            {siteHostLabel(m.siteUrl)}
          </a>
        </p>
        <hr className="resume-print__rule" />
      </header>

      {/* ─── THESIS ───────────────────────────────────────── */}
      <p className="resume-print__thesis">
        <em>{RESUME.hero.tagline}</em>
      </p>

      {/* ─── HOW I WORK ──────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">
          {titleCaseLabel(RESUME.sections.operatingModel.label)}
        </h2>
        {RESUME.operatingModel.paragraphs.map((p, i) => (
          <p className="resume-print__paragraph" key={i}>
            {p}
          </p>
        ))}
      </section>

      {/* ─── OUTCOMES ─────────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">{RESUME.sections.impact.label}</h2>
        <dl className="resume-print__outcomes">
          {RESUME.impact.map((o) => (
            <div className="resume-print__outcome-row" key={o.value}>
              <dt className="resume-print__outcome-anchor">{o.value}</dt>
              <dd className="resume-print__outcome-body">{o.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── EXPERIENCE ──────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">{RESUME.sections.experience.label}</h2>

        {primary.map((entry) => {
          const firstCard = entry.cards[0];
          const dateRange = entry.pdfRange ?? entry.range;
          return (
            <article className="resume-print__role" key={`${firstCard.company}-${entry.range}`}>
              <header className="resume-print__role-head">
                <h3 className="resume-print__company">{firstCard.company}</h3>
                <span className="resume-print__dates">{dateRange}</span>
              </header>

              {entry.cards.map((card, idx) => {
                const showCrossCardConnector = idx > 0 && !!card.promotedFrom;
                const showIntraCardNote =
                  idx === 0 && !!card.promotedFrom && entry.cards.length === 1;
                const connectorYear =
                  showCrossCardConnector
                    ? startYearFromDates(entry.cards[idx - 1]?.dates)
                    : null;
                return (
                  <div className="resume-print__sub-role" key={`${card.role}-${idx}`}>
                    {showCrossCardConnector ? (
                      <p className="resume-print__connector">
                        ↑ {card.promotedFrom}
                        {connectorYear ? ` (${connectorYear})` : ''}
                      </p>
                    ) : null}
                    <p className="resume-print__role-title">
                      {card.role}
                      {card.badge ? (
                        <span className="resume-print__badge">
                          {card.badge.charAt(0) + card.badge.slice(1).toLowerCase()}
                        </span>
                      ) : null}
                      {card.dates ? (
                        <span className="resume-print__role-dates">{card.dates}</span>
                      ) : null}
                      {showIntraCardNote ? (
                        <span className="resume-print__role-note">{card.promotedFrom}</span>
                      ) : null}
                    </p>
                    {card.bullets ? (
                      <ul className="resume-print__bullets">
                        {card.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </article>
          );
        })}
      </section>

      {/* ─── CONSULTING & FRACTIONAL ─────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">{UI.print.consultingHeading}</h2>

        {consulting.map((entry) => {
          const card = entry.cards[0];
          return (
            <article
              className="resume-print__consulting"
              key={`${card.company}-${entry.range}`}
            >
              <header className="resume-print__consulting-head">
                <span className="resume-print__consulting-name">
                  {card.company} — {card.role}
                </span>
                <span className="resume-print__dates">{entry.range}</span>
              </header>
              {card.description ? (
                <p className="resume-print__consulting-body">
                  {card.description}
                  {card.link ? (
                    <>
                      {' '}
                      <a
                        href={card.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-print__inline-link"
                      >
                        {card.link.label}
                      </a>
                    </>
                  ) : null}
                </p>
              ) : null}
            </article>
          );
        })}
      </section>

      {/* ─── TOOLKIT ─────────────────────────────────────── */}
      <section className="resume-print__section">
        <h2 className="resume-print__section-head">{RESUME.sections.tech.label}</h2>
        <dl className="resume-print__toolkit">
          {RESUME.tech.map((b) => (
            <div className="resume-print__toolkit-row" key={b.label}>
              <dt>{b.label}</dt>
              <dd>{b.pills.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Education intentionally omitted from the PDF — the conservatory
          degree felt out of place against the engineering content. It still
          appears as a footer line on the website at resume.lalalimited.com. */}
    </article>
  );
}
