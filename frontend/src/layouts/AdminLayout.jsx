import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABEL } from '../constants';

export default function AdminLayout() {
  const [bukaSidebar, setBukaSidebar] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const keluar = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="flex min-h-screen bg-kabut">
      <AdminSidebar buka={bukaSidebar} onTutup={() => setBukaSidebar(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-hutan-900/10 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 text-hutan-900 lg:hidden" onClick={() => setBukaSidebar(true)} aria-label="Buka menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-bold text-hutan-950">{admin?.nama}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emas-dark">{ROLE_LABEL[admin?.role]}</p>
            </div>
            <button onClick={keluar} className="rounded-full border border-hutan-900/15 px-4 py-2 text-xs font-bold text-hutan-900 transition hover:bg-hutan-900 hover:text-kabut">
              Keluar
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
