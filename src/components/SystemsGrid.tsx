import { useResume } from '@/content/resume-context';
import SectionIndex from './SectionIndex';
import './SystemsGrid.css';

export default function SystemsGrid() {
  const { resume: RESUME } = useResume();
  const s = RESUME.sections.systems;
  return (
    <section className="section systems" aria-labelledby="systems-heading">
      <div className="container systems__inner">
        <header className="systems__head">
          <SectionIndex number={s.number} label={s.label} />
          <div className="section-head">
            <h2 id="systems-heading">{s.heading}</h2>
            {s.descriptor ? <p>{s.descriptor}</p> : null}
          </div>
        </header>

        <ul className="systems__grid" role="list">
          {RESUME.systems.map((s) => (
            <li className="systems__card" key={s.title}>
              <p className="mono-meta">{s.kicker}</p>
              <h3 className="systems__title font-display">{s.title}</h3>
              <p className="systems__lede font-display">{s.lede}</p>
              <ul className="systems__bullets" role="list">
                {s.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              <ul className="pill-row systems__tags" role="list">
                {s.tags.map((t) => (
                  <li key={t} className="pill">{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
