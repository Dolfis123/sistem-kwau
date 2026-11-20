import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TombolWA from '../components/layout/TombolWA';

export default function PublicLayout() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    // Konten dimuat dari API, jadi coba gulir beberapa kali sampai elemennya muncul
    let percobaan = 0;
    const gulir = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else if (percobaan++ < 8) setTimeout(gulir, 300);
    };
    setTimeout(gulir, 200);
  }, [pathname, hash]);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <TombolWA />
    </div>
  );
}
