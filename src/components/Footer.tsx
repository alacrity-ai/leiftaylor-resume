import { useResume } from '@/content/resume-context';
import './Footer.css';

export default function Footer() {
  const { resume: RESUME, ui: UI } = useResume();
  const f = UI.footer;
  const year = new Date().getFullYear();
  // Strip protocol from siteUrl for the © row's bare-domain rendering.
  const siteHost = RESUME.meta.siteUrl.replace(/^https?:\/\//, '');
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__build">
        <p className="footer__build-line">
          <span className="font-display footer__build-lead">
            <em>{f.repoLead}</em> {f.repoArrow}
          </span>{' '}
          <a
            href={f.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="footer__build-link font-mono"
          >
            {f.repoLabel}
          </a>
        </p>
      </div>
      <div className="container footer__background font-mono">
        {RESUME.background}
      </div>
      <div className="container footer__inner font-mono">
        <span>© {year} {f.copyrightOwner}</span>
        <span aria-hidden="true" className="footer__sep">·</span>
        <span>{f.reviewedLabel} {RESUME.meta.lastReviewed}</span>
        <span aria-hidden="true" className="footer__sep">·</span>
        <span>{siteHost}</span>
      </div>
    </footer>
  );
}
