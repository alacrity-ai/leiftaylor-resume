import { useResume } from '@/content/resume-context';
import NowLine from './NowLine';
import './Hero.css';

interface Props {
  onOpenContact: () => void;
  onOpenDownload: () => void;
}

export default function Hero({ onOpenContact, onOpenDownload }: Props) {
  const { resume: RESUME, ui: u } = useResume();
  const m = RESUME.meta;
  const h = RESUME.hero;
  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="container-wide hero__grid">
        <div className="hero__main">
          <p className="mono-meta mono-meta--accent stagger" style={{ ['--stagger-delay' as string]: '0ms' }}>
            {h.eyebrow}
          </p>

          <h1
            id="hero-name"
            className="hero__name font-display opsz-display stagger"
            style={{ ['--stagger-delay' as string]: '90ms' }}
          >
            {h.name}
          </h1>

          <p
            className="hero__tagline font-display opsz-head stagger"
            style={{ ['--stagger-delay' as string]: '180ms' }}
          >
            {h.tagline}
          </p>

          <p
            className="hero__body stagger"
            style={{ ['--stagger-delay' as string]: '260ms' }}
          >
            {h.body}
          </p>

          <div
            className="hero__ctas stagger"
            style={{ ['--stagger-delay' as string]: '340ms' }}
          >
            <button type="button" className="btn btn-primary" onClick={onOpenContact}>
              {u.cta.emailLeif}
            </button>
            <a
              className="btn"
              href={m.calendly}
              target="_blank"
              rel="noreferrer"
            >
              {u.cta.scheduleCall}
            </a>
            <button type="button" className="btn" onClick={onOpenDownload}>
              {u.cta.downloadResume}
            </button>
            <a className="btn btn-ghost" href={m.linkedin} target="_blank" rel="noreferrer">
              {u.cta.linkedin} <span aria-hidden="true">{u.cta.linkedinArrow}</span>
            </a>
          </div>

          <div className="stagger" style={{ ['--stagger-delay' as string]: '440ms' }}>
            <NowLine text={h.nowLine} />
          </div>
        </div>

        <aside
          className="hero__glance stagger"
          style={{ ['--stagger-delay' as string]: '520ms' }}
          aria-label={u.hero.atAGlance}
        >
          <p className="mono-meta">{u.hero.atAGlance}</p>
          <dl className="hero__glance-list">
            {h.glance.map((g) => (
              <div className="hero__glance-row" key={g.label}>
                <dt className="mono-meta mono-meta--faint">{g.label}</dt>
                <dd className="hero__glance-value">{g.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}
