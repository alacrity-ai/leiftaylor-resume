import './HelloCard.css';

interface Props {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

/**
 * Variant-only intro band rendered above the hero on a tailored slug.
 * Renders as a full-bleed strip with a paper-tinted background and
 * oxblood top + bottom rules — distinct enough to read as "tailored,"
 * subtle enough to feel native to the rest of the page.
 *
 * Only mounts when `Variant.hello` is set on the resolved variant
 * (HomePage gates the render). The global `/` route never sees it.
 */
export default function HelloCard({ title, body, cta }: Props) {
  return (
    <aside
      className="hello-card"
      role="complementary"
      aria-label={title}
    >
      <div className="container hello-card__inner">
        <p className="mono-meta mono-meta--accent hello-card__kicker">
          A note for this reader
        </p>
        <h2 className="hello-card__title font-display opsz-head">{title}</h2>
        <p className="hello-card__body">{body}</p>
        {cta ? (
          <a
            className="btn btn-primary hello-card__cta"
            href={cta.href}
            target="_blank"
            rel="noreferrer"
          >
            {cta.label}
          </a>
        ) : null}
      </div>
    </aside>
  );
}
