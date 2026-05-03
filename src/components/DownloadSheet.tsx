import { useEffect, useRef } from 'react';
import { useResume } from '@/content/resume-context';
import './DownloadSheet.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Slide-up sheet that lets the visitor pick which résumé format to
 * download — PDF (recruiter-default, browser-friendly) or DOCX (the most
 * reliably-parsed format for older ATS systems).
 *
 * Anchored to the bottom of the viewport. Backdrop click and ESC close
 * the sheet. First focusable item is auto-focused on open.
 */
export default function DownloadSheet({ open, onClose }: Props) {
  const { resume: RESUME, ui } = useResume();
  const D = ui.download;
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      const first = sheetRef.current?.querySelector<HTMLElement>('a, button');
      first?.focus();
    }, 60);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger && trigger instanceof HTMLElement) trigger.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="dl-sheet-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheetRef}
        className="dl-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dl-sheet-title"
      >
        <header className="dl-sheet__head">
          <h2 id="dl-sheet-title" className="dl-sheet__title font-display">
            {D.title}
          </h2>
          <button
            type="button"
            className="dl-sheet__close font-mono"
            onClick={onClose}
            aria-label="Close"
          >
            {D.closeLabel}
          </button>
        </header>

        <p className="dl-sheet__sub">{D.sub}</p>

        <ul className="dl-sheet__options" role="list">
          <li>
            <a
              className="dl-sheet__option"
              href={RESUME.meta.pdfHref}
              download
              onClick={onClose}
            >
              <span className="dl-sheet__format font-mono">{D.pdf.format}</span>
              <span className="dl-sheet__option-body">
                <span className="dl-sheet__option-title">{D.pdf.title}</span>
                <span className="dl-sheet__option-desc">{D.pdf.desc}</span>
              </span>
              <span className="dl-sheet__arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </li>
          <li>
            <a
              className="dl-sheet__option"
              href={RESUME.meta.docxHref}
              download
              onClick={onClose}
            >
              <span className="dl-sheet__format font-mono">{D.docx.format}</span>
              <span className="dl-sheet__option-body">
                <span className="dl-sheet__option-title">{D.docx.title}</span>
                <span className="dl-sheet__option-desc">{D.docx.desc}</span>
              </span>
              <span className="dl-sheet__arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </li>
        </ul>

        <p className="dl-sheet__note mono-meta mono-meta--faint">{D.note}</p>
      </div>
    </div>
  );
}
