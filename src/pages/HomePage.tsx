import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Hero from '../components/Hero';
import OperatingModel from '../components/OperatingModel';
import ImpactStrip from '../components/ImpactStrip';
import SystemsGrid from '../components/SystemsGrid';
import ExperienceTimeline from '../components/ExperienceTimeline';
import TechSurface from '../components/TechSurface';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import DownloadSheet from '../components/DownloadSheet';
import HelloCard from '../components/HelloCard';
import NotFound from './NotFound';
import { ResumeContext } from '@/content/resume-context';
import { resolveVariant } from '@/content/resolve-variant';

export default function HomePage() {
  const { slug } = useParams();
  const resolved = resolveVariant(slug);

  const [contactOpen, setContactOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('is-loaded');
  }, []);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const openDownload = useCallback(() => setDownloadOpen(true), []);
  const closeDownload = useCallback(() => setDownloadOpen(false), []);

  // Unknown slug (provided but not registered) → 404. Per
  // DATA_DRIVEN_IMPLEMENTATION.md §1.4 question 3 — render the page
  // explicitly rather than silently falling through to global.
  if (resolved === null) return <NotFound />;

  return (
    <ResumeContext.Provider value={resolved}>
      <a href="#impact" className="skip-link">Skip to content</a>
      {resolved.hello ? <HelloCard {...resolved.hello} /> : null}
      <main role="main">
        <Hero onOpenContact={openContact} onOpenDownload={openDownload} />
        <OperatingModel />
        <ImpactStrip />
        <SystemsGrid />
        <ExperienceTimeline />
        <TechSurface />
        <Contact onOpenContact={openContact} onOpenDownload={openDownload} />
      </main>
      <Footer />
      <ContactModal open={contactOpen} onClose={closeContact} />
      <DownloadSheet open={downloadOpen} onClose={closeDownload} />
    </ResumeContext.Provider>
  );
}
