import { RESUME } from '@/content/resume';
import SectionIndex from './SectionIndex';
import './TechSurface.css';

export default function TechSurface() {
  return (
    <section className="section tech" aria-labelledby="tech-heading">
      <div className="container tech__inner">
        <header className="tech__head">
          <SectionIndex number="05" label="Toolkit" />
          <h2 id="tech-heading" className="tech__heading font-display opsz-head">
            Toolkit.
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
