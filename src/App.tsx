import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResumePrint from './print/ResumePrint';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/print/resume" element={<ResumePrint />} />
    </Routes>
  );
}
