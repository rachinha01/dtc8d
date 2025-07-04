import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { UpsellPage } from './pages/UpsellPage.tsx';
import { DownsellPage } from './pages/DownsellPage.tsx';
import './index.css';

// ✅ SEO OTIMIZADO: Componente para páginas fantasma que redirecionam para home
const GhostPage: React.FC = () => {
  // Redireciona imediatamente para a página inicial
  window.location.href = '/';
  return null;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<App />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Upsell Pages */}
        <Route path="/up1bt" element={<UpsellPage variant="1-bottle" />} />
        <Route path="/up3bt" element={<UpsellPage variant="3-bottle" />} />
        <Route path="/up6bt" element={<UpsellPage variant="6-bottle" />} />
        
        {/* Downsell Pages */}
        <Route path="/dws1" element={<DownsellPage variant="dws1" />} />
        <Route path="/dws2" element={<DownsellPage variant="dws2" />} />
        <Route path="/dw3" element={<DownsellPage variant="dw3" />} />

        {/* ✅ SEO OTIMIZADO: Páginas fantasma para ranquear - redirecionam para home */}
        <Route path="/ed-trick" element={<GhostPage />} />
        <Route path="/turmeric-trick" element={<GhostPage />} />
        <Route path="/baking-soda-trick-review" element={<GhostPage />} />
        <Route path="/natural-erection-trick" element={<GhostPage />} />
        <Route path="/curcumin-ed-support" element={<GhostPage />} />
        <Route path="/watermelon-trick" element={<GhostPage />} />
        <Route path="/natural-ed-remedy" element={<GhostPage />} />
        <Route path="/male-enhancement-liquid" element={<GhostPage />} />
        <Route path="/best-ed-drops" element={<GhostPage />} />
        <Route path="/liquid-ed-formula" element={<GhostPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);