import './NowLine.css';

interface Props {
  text: string;
}

/**
 * Single mono line below the hero CTAs. Carries the "living" promise —
 * a status flex, not a "currently taken" signal.
 *
 * Strips the leading "NOW — " token from the supplied text and renders it as
 * a separate, accent-colored badge so the rest of the line stays in ink.
 */
export default function NowLine({ text }: Props) {
  const [token, ...rest] = text.split(' — ');
  const body = rest.join(' — ');

  return (
    <p className="now-line font-mono" aria-label="Current status">
      <span className="now-line__dot" aria-hidden="true" />
      <span className="now-line__token">{token}</span>
      <span className="now-line__body">{body}</span>
    </p>
  );
}
