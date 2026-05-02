import { RESUME } from '@/content/resume';
import './Footer.css';

const REPO_URL = 'https://github.com/alacrity-ai/leiftaylor-resume';
const REPO_LABEL = 'github.com/alacrity-ai/leiftaylor-resume';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__build">
        <p className="footer__build-line">
          <span className="font-display footer__build-lead">
            <em>See how this résumé was made</em> →
          </span>{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="footer__build-link font-mono"
          >
            {REPO_LABEL}
          </a>
        </p>
      </div>
      <div className="container footer__background font-mono">
        {RESUME.background}
      </div>
      <div className="container footer__inner font-mono">
        <span>© {year} Leif Taylor</span>
        <span aria-hidden="true" className="footer__sep">·</span>
        <span>Reviewed {RESUME.meta.lastReviewed}</span>
        <span aria-hidden="true" className="footer__sep">·</span>
        <span>resume.lalalimited.com</span>
      </div>
    </footer>
  );
}
