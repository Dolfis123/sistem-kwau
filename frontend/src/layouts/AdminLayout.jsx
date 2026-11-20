import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import AdminSidebar, { SEMUA_MENU } from '../components/layout/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABEL } from '../constants';

export default function AdminLayout() {
  const [bukaSidebar, setBukaSidebar] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Judul halaman aktif di header (paling panjang yang cocok)
  const aktif = [...SEMUA_MENU]
    .sort((a, b) => b.to.length - a.to.length)
    .find((m) => (m.end ? pathname === m.to : pathname.startsWith(m.to)));

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = bukaSidebar ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [bukaSidebar]);

  const keluar = () => { logout(); navigate('/admin/login'); };
  const inisial = (admin?.nama || 'A').trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#f4f2ec]">
      <AdminSidebar buka={bukaSidebar} onTutup={() => setBukaSidebar(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-hutan-900/[.08] bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button className="-ml-1.5 rounded-xl p-2 text-hutan-900 hover:bg-hutan-100 lg:hidden" onClick={() => setBukaSidebar(true)} aria-label="Buka menu">
              <Menu size={22} />
            </button>
            {aktif && (
              <p className="flex min-w-0 items-center gap-2 truncate text-sm font-bold text-hutan-950">
                <aktif.Ikon size={17} className="shrink-0 text-emas-dark" aria-hidden="true" /> {aktif.label}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-bold text-hutan-950">{admin?.nama}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-emas-dark">{ROLE_LABEL[admin?.role]}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hutan-900 text-xs font-bold text-emas-light" title={admin?.nama}>
              {inisial}
            </span>
            <button onClick={keluar} className="flex items-center gap-1.5 rounded-full border border-hutan-900/15 px-3 py-2 text-xs font-bold text-hutan-900 transition hover:bg-hutan-900 hover:text-kabut" aria-label="Keluar">
              <LogOut size={15} aria-hidden="true" /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><Outlet /></main>
      </div>
    </div>
  );
}
