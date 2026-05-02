import { RESUME } from '@/content/resume';
import SectionIndex from './SectionIndex';
import './OperatingModel.css';

export default function OperatingModel() {
  const { heading, paragraphs } = RESUME.operatingModel;

  return (
    <section
      className="section operating-model"
      aria-labelledby="operating-model-heading"
    >
      <div className="container operating-model__inner">
        <SectionIndex number="01" label="How I work" />
        <h2
          id="operating-model-heading"
          className="operating-model__heading font-display opsz-head"
        >
          {heading}
        </h2>

        <div className="operating-model__body">
          {paragraphs.map((p, i) => (
            <p className="operating-model__paragraph" key={i}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
