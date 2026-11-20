import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo';
import LangSwitch from './LangSwitch';
import { useLang } from '../../i18n/LanguageContext';

// Menu utama (selalu tampil di desktop) dan menu "Lainnya"
const UTAMA = [
  ['/tentang', 'nav.tentang'],
  ['/paket-wisata', 'nav.paket'],
  ['/peta', 'nav.peta'],
  ['/pertanian', 'nav.pertanian'],
  ['/jejak-wisatawan', 'nav.jejak'],
];
const LAINNYA = [
  ['/informasi', 'nav.informasi'],
  ['/faq', 'nav.faq'],
  ['/kontak', 'nav.kontak'],
];

export default function Navbar() {
  const { t } = useLang();
  const [scroll, setScroll] = useState(false);
  const [buka, setBuka] = useState(false);
  const [lainnya, setLainnya] = useState(false);
  const refLainnya = useRef(null);
  const lokasi = useLocation();
  const diBeranda = lokasi.pathname === '/';

  useEffect(() => {
    const cek = () => setScroll(window.scrollY > 24);
    cek();
    window.addEventListener('scroll', cek, { passive: true });
    return () => window.removeEventListener('scroll', cek);
  }, []);

  useEffect(() => { setBuka(false); setLainnya(false); }, [lokasi.pathname]);

  // Tutup dropdown "Lainnya" saat klik di luar
  useEffect(() => {
    if (!lainnya) return undefined;
    const klik = (e) => { if (!refLainnya.current?.contains(e.target)) setLainnya(false); };
    document.addEventListener('mousedown', klik);
    return () => document.removeEventListener('mousedown', klik);
  }, [lainnya]);

  // Kunci scroll saat menu mobile terbuka
  useEffect(() => {
    document.body.style.overflow = buka ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [buka]);

  const solid = scroll || !diBeranda || buka;
  const kelasLink = ({ isActive }) =>
    `relative whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold transition ${
      isActive ? 'text-emas-light' : 'text-kabut/80 hover:text-kabut'
    }`;
  const lainnyaAktif = LAINNYA.some(([to]) => lokasi.pathname.startsWith(to));

  return (
    <header className={`fixed inset-x-0 top-0 z-[1100] transition-all duration-300 ${
      solid ? 'bg-hutan-950/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,.5)] backdrop-blur-xl' : 'bg-gradient-to-b from-black/40 to-transparent'
    }`}>
      <div className="wadah flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <Logo />
          <span className="leading-tight text-kabut">
            <span className="block font-display text-[17px] font-medium">Kampung Kwau</span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-kabut/55 min-[400px]:block">Arfak · Papua Barat</span>
          </span>
        </Link>

        <nav className="hidden items-center xl:flex" aria-label="Main">
          {UTAMA.map(([to, kunci]) => (
            <NavLink key={to} to={to} className={kelasLink}>{t(kunci)}</NavLink>
          ))}
          <div className="relative" ref={refLainnya}>
            <button type="button" onClick={() => setLainnya(!lainnya)} aria-expanded={lainnya}
              className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-semibold transition ${lainnyaAktif ? 'text-emas-light' : 'text-kabut/80 hover:text-kabut'}`}>
              {t('nav.lainnya')} <ChevronDown size={14} className={`transition ${lainnya ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {lainnya && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl bg-white p-1.5 shadow-angkat ring-1 ring-hutan-900/10">
                {LAINNYA.map(([to, kunci]) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) => `block rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-hutan-100 text-hutan-900' : 'text-tinta/75 hover:bg-hutan-50 hover:text-hutan-900'}`}>
                    {t(kunci)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2.5">
          <LangSwitch />
          <Link to="/paket-wisata" className="btn-emas hidden whitespace-nowrap !px-5 !py-2.5 !text-[13px] md:inline-flex">{t('nav.pesan')}</Link>
          <button
            className="rounded-full p-2 text-kabut ring-1 ring-white/15 xl:hidden"
            onClick={() => setBuka(!buka)}
            aria-label={buka ? t('nav.tutupMenu') : t('nav.bukaMenu')}
            aria-expanded={buka}
          >
            {buka ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu mobile layar penuh */}
      {buka && (
        <nav className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/10 bg-hutan-950 px-4 pb-10 pt-4 xl:hidden" aria-label="Mobile">
                    {[['/', 'nav.beranda'], ...UTAMA, ...LAINNYA].map(([to, kunci]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-white/[.07] px-2 py-4 font-display text-xl ${isActive ? 'text-emas-light' : 'text-kabut/90'}`}>
              {t(kunci)} <ArrowRight size={18} className="opacity-40" aria-hidden="true" />
            </NavLink>
          ))}
          <Link to="/paket-wisata" className="btn-emas mt-8 w-full">{t('nav.pesan')}</Link>
        </nav>
      )}
    </header>
  );
}
