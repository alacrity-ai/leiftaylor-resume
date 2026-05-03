import { useResume } from '@/content/resume-context';
import SectionIndex from './SectionIndex';
import './TechSurface.css';

export default function TechSurface() {
  const { resume: RESUME } = useResume();
  const s = RESUME.sections.tech;
  return (
    <section className="section tech" aria-labelledby="tech-heading">
      <div className="container tech__inner">
        <header className="tech__head">
          <SectionIndex number={s.number} label={s.label} />
          <h2 id="tech-heading" className="tech__heading font-display opsz-head">
            {s.heading}
          </h2>
        </header>

        <dl className="tech__list">
          {RESUME.tech.map((g, i) => (
            <div className="tech__row" key={g.label} data-row={i}>
              <dt className="tech__label mono-meta">{g.label}</dt>
              <dd className="tech__pills">
                <ul className="pill-row" role="list">
                  {g.pills.map((p) => (
                    <li key={p} className="pill">{p}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
