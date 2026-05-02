import './SectionIndex.css';

interface Props {
  number: string;
  label: string;
}

/**
 * Numbered gutter index — `01 / IMPACT`.
 * Sits in the left gutter on desktop; collapses to an inline mono kicker on
 * narrow screens so the section reads cleanly without competing with type.
 */
export default function SectionIndex({ number, label }: Props) {
  return (
    <div className="section-index" aria-hidden="true">
      <span className="section-index__num font-mono">{number}</span>
      <span className="section-index__sep" />
      <span className="section-index__label font-mono">{label}</span>
    </div>
  );
}
