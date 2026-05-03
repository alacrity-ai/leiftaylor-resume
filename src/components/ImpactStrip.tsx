import { useResume } from '@/content/resume-context';
import SectionIndex from './SectionIndex';
import './ImpactStrip.css';

export default function ImpactStrip() {
  const { resume: RESUME } = useResume();
  const s = RESUME.sections.impact;
  return (
    <section
      id="impact"
      className="section impact"
      aria-labelledby="impact-heading"
    >
      <div className="container impact__inner">
        <div className="impact__head">
          <SectionIndex number={s.number} label={s.label} />
          <h2 id="impact-heading" className="visually-hidden">
            {s.label}
          </h2>
        </div>

        <ol className="impact__list" role="list">
          {RESUME.impact.map((m, i) => (
            <li className="impact__row" key={m.value}>
              <span className="impact__num font-mono" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="impact__content">
                <span className="impact__value font-display">{m.value}</span>
                <p className="impact__label">{m.label}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
