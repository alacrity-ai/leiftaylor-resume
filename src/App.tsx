import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ResumePrint from './print/ResumePrint';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/print/resume" element={<ResumePrint />} />
      <Route path="/:slug" element={<HomePage />} />
      <Route path="/:slug/print/resume" element={<ResumePrint />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
