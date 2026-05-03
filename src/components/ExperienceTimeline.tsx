import { useResume } from '@/content/resume-context';
import SectionIndex from './SectionIndex';
import './ExperienceTimeline.css';

export default function ExperienceTimeline() {
  const { resume: RESUME } = useResume();
  const s = RESUME.sections.experience;
  return (
    <section
      className="section section-tinted experience"
      aria-labelledby="experience-heading"
    >
      <div className="container experience__inner">
        <header className="experience__head">
          <SectionIndex number={s.number} label={s.label} />
          <div className="section-head">
            <h2 id="experience-heading">{s.heading}</h2>
            {s.descriptor ? <p>{s.descriptor}</p> : null}
          </div>
        </header>

        <ol className="timeline" role="list">
          {RESUME.experience.map((entry, entryIdx) => (
            <li className="timeline__entry" key={`${entry.range}-${entryIdx}`}>
              <div className="timeline__date font-mono">{entry.range}</div>
              <div className="timeline__cards">
                {entry.cards.map((card, idx) => {
                  // Cross-card connector: shown at the top of the 2nd+ card in
                  // a split entry, indicating the role above grew out of this
                  // one. ConnectBase uses this — Director of DevOps shows
                  // "↑ Promoted to Principal Engineer" above its content.
                  const isCrossCardConnector = idx > 0 && !!card.promotedFrom;
                  // Intra-card sub-line: shown for single-card entries that
                  // carry a promotion note within one role (e.g., Mobile
                  // Heartbeat: "Promoted from Senior DevOps Engineer").
                  const isIntraCardNote = idx === 0 && !!card.promotedFrom;

                  return (
                    <article
                      className={`timeline__card ${card.badge ? 'timeline__card--current' : ''}`}
                      key={`${card.company}-${card.role}`}
                    >
                      {card.badge ? (
                        <span className="timeline__badge font-mono">{card.badge}</span>
                      ) : null}

                      {isCrossCardConnector ? (
                        <p className="timeline__connector mono-meta mono-meta--faint">
                          ↑ {card.promotedFrom}
                        </p>
                      ) : null}

                      <header className="timeline__card-head">
                        <h3 className="timeline__company font-display">{card.company}</h3>
                        <p className="timeline__role">{card.role}</p>
                        {card.dates ? (
                          <p className="mono-meta mono-meta--faint timeline__sub">{card.dates}</p>
                        ) : null}
                        {isIntraCardNote ? (
                          <p className="mono-meta mono-meta--faint timeline__sub">{card.promotedFrom}</p>
                        ) : null}
                      </header>

                      {card.description ? (
                        <p className="timeline__description">{card.description}</p>
                      ) : null}

                      {card.bullets && card.bullets.length > 0 ? (
                        <ul className="timeline__bullets" role="list">
                          {card.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      ) : null}

                      {card.tags && card.tags.length > 0 ? (
                        <ul className="pill-row timeline__tags" role="list">
                          {card.tags.map((t) => (
                            <li key={t} className="pill">{t}</li>
                          ))}
                        </ul>
                      ) : null}

                      {card.link ? (
                        <a
                          className="timeline__link font-mono"
                          href={card.link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {card.link.label} <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
