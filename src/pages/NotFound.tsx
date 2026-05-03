import { Link } from 'react-router-dom';
import { UI } from '@/content/ui';
import './NotFound.css';

const N = UI.notFound;

/**
 * Fallback page for unknown slugs. Stays bare on purpose — no variant
 * data leaks (the page doesn't list valid slugs), and the visual
 * register matches the rest of the site.
 */
export default function NotFound() {
  return (
    <main className="notfound" role="main">
      <div className="container notfound__inner">
        <p className="mono-meta mono-meta--accent notfound__eyebrow">{N.eyebrow}</p>
        <h1 className="notfound__heading font-display opsz-display">{N.heading}</h1>
        <p className="notfound__body">{N.body}</p>
        <Link to="/" className="btn btn-primary notfound__home">
          {N.homeLabel}
        </Link>
      </div>
    </main>
  );
}
