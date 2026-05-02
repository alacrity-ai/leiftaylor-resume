import { RESUME } from '@/content/resume';
import SectionIndex from './SectionIndex';
import './Contact.css';

const m = RESUME.meta;
const c = RESUME.contact;

interface Props {
  onOpenContact: () => void;
  onOpenDownload: () => void;
}

export default function Contact({ onOpenContact, onOpenDownload }: Props) {
  return (
    <section className="section contact" aria-labelledby="contact-heading">
      <div className="container contact__inner">
        <header className="contact__head">
          <SectionIndex number="06" label="Contact" />
        </header>

        <div className="contact__grid">
          <div>
            <h2 id="contact-heading" className="contact__heading font-display">
              {c.heading}
            </h2>
            <p className="contact__body">{c.body}</p>
          </div>

          <div className="contact__box">
            <p className="mono-meta mono-meta--accent contact__box-kicker">Contact</p>
            <ul className="contact__links" role="list">
              <li>
                <button className="contact__send-btn link" type="button" onClick={onOpenContact}>
                  Send Leif a message →
                </button>
              </li>
              <li>
                <a className="link" href={m.calendly} target="_blank" rel="noreferrer">
                  Schedule 30 min on my calendar →
                </a>
              </li>
              <li>
                <a className="link" href={m.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn — leiftaylor
                </a>
              </li>
              <li>
                <button className="contact__send-btn link" type="button" onClick={onOpenDownload}>
                  Download résumé →
                </button>
              </li>
            </ul>
            <hr className="rule contact__rule" />
            <p className="contact__github mono-meta mono-meta--faint">{c.githubNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
