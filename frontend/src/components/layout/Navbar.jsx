import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
// import SosmedIcons from '../common/SosmedIcons';
import useFetch from '../../hooks/useFetch';
import { kontenApi } from '../../services/api';

const MENU = [
  { to: '/', label: 'Beranda' },
  { to: '/tentang', label: 'Tentang Kwau' },
  { to: '/paket-wisata', label: 'Paket Wisata' },
  { to: '/peta', label: 'Peta Interaktif' },
  { to: '/pertanian', label: 'Hasil Pertanian' },
  { to: '/informasi', label: 'Informasi' },
  { to: '/jejak-wisatawan', label: 'Jejak Wisatawan' },
  { to: '/faq', label: 'FAQ' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [scroll, setScroll] = useState(false);
  const [buka, setBuka] = useState(false);
  const lokasi = useLocation();
  const { data: pengaturan } = useFetch(() => kontenApi.getPengaturan(), []);
  const diBeranda = lokasi.pathname === '/';

  useEffect(() => {
    const cek = () => setScroll(window.scrollY > 24);
    cek();
    window.addEventListener('scroll', cek, { passive: true });
    return () => window.removeEventListener('scroll', cek);
  }, []);

  useEffect(() => setBuka(false), [lokasi.pathname]);

  const solid = scroll || !diBeranda || buka;

  return (
    <header className={`fixed inset-x-0 top-0 z-[1100] transition-all duration-300 ${solid ? 'bg-hutan-950/95 shadow-lg backdrop-blur' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="leading-tight text-kabut">
            <span className="block font-display text-base font-semibold">Kampung Kwau</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-kabut/60">Pegunungan Arfak</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Navigasi utama">
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-[13px] font-semibold transition ${
                  isActive ? 'bg-kabut/10 text-emas-light' : 'text-kabut/80 hover:bg-kabut/10 hover:text-kabut'
                }`
              }
            >
              {m.label}
            </NavLink>
          ))}
          <Link to="/paket-wisata" className="btn-emas ml-2 !px-5 !py-2 !text-[13px]">Pesan Sekarang</Link>
          {/* <SosmedIcons pengaturan={pengaturan} className="ml-2" tombol="h-8 w-8 rounded-full text-kabut/60 hover:bg-kabut/10 hover:text-emas-light" /> */}
        </nav>

        <button
          className="rounded-lg p-2 text-kabut xl:hidden"
          onClick={() => setBuka(!buka)}
          aria-label={buka ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={buka}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {buka ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {buka && (
        <nav className="border-t border-kabut/10 bg-hutan-950/98 px-4 pb-6 pt-2 xl:hidden" aria-label="Navigasi mobile">
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? 'bg-kabut/10 text-emas-light' : 'text-kabut/85'}`
              }
            >
              {m.label}
            </NavLink>
          ))}
          <Link to="/paket-wisata" className="btn-emas mt-3 w-full">Pesan Sekarang</Link>
          {/* <SosmedIcons pengaturan={pengaturan} className="mt-4 justify-center" /> */}
        </nav>
      )}
    </header>
  );
}
