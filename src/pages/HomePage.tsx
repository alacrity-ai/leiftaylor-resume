import { useCallback, useEffect, useState } from 'react';
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

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('is-loaded');
  }, []);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const openDownload = useCallback(() => setDownloadOpen(true), []);
  const closeDownload = useCallback(() => setDownloadOpen(false), []);

  return (
    <>
      <a href="#impact" className="skip-link">Skip to content</a>
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
    </>
  );
}
