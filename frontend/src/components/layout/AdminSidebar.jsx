import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

// V3: menu dipisah sesuai tanggung jawab role masing-masing
const MENU = [
  { to: '/admin', label: 'Dashboard', ikon: '▦', end: true, roles: null },
  // — Wisata —
  { to: '/admin/reservasi', label: 'Reservasi', ikon: '🗓', roles: ['admin_reservasi'] },
  { to: '/admin/moderasi', label: 'Moderasi Galeri', ikon: '🖼', roles: ['admin_konten'] },
  { to: '/admin/paket', label: 'Paket Wisata', ikon: '🥾', roles: ['admin_konten'] },
  { to: '/admin/konten', label: 'Konten Wisata', ikon: '📚', roles: ['admin_konten'] },
  { to: '/admin/peta', label: 'Peta & Tokoh', ikon: '📍', roles: ['admin_konten'] },
  // — Kampung —
  { to: '/admin/informasi', label: 'Informasi Kampung', ikon: '📰', roles: ['pegawai_kampung', 'admin_pertanian'] },
  // — Pertanian —
  { to: '/admin/pertanian', label: 'Hasil Pertanian', ikon: '🌾', roles: ['admin_pertanian'] },
  // — Umum —
  { to: '/admin/pesan', label: 'Pesan Kontak', ikon: '✉', roles: ['admin_reservasi', 'admin_konten', 'pegawai_kampung'] },
  { to: '/admin/pengguna', label: 'Pengguna Admin', ikon: '👥', roles: [] }, // superadmin saja
  { to: '/admin/pengaturan', label: 'Pengaturan', ikon: '⚙', roles: null },
];

export default function AdminSidebar({ buka, onTutup }) {
  const { admin } = useAuth();

  const bolehLihat = (roles) => {
    if (roles === null) return true; // semua role
    if (admin?.role === 'superadmin') return true;
    return roles.includes(admin?.role);
  };

  return (
    <>
      {buka && <div className="fixed inset-0 z-40 bg-hutan-950/50 lg:hidden" onClick={onTutup} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-hutan-950 text-kabut transition-transform lg:static lg:translate-x-0 ${buka ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-2.5 border-b border-kabut/10 px-5">
          <Logo ukuran="h-8 w-8" teksUkuran="text-base" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Portal Kwau</p>
            <p className="text-[10px] uppercase tracking-widest text-kabut/50">Dashboard Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu admin">
          {MENU.filter((m) => bolehLihat(m.roles)).map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              onClick={onTutup}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'bg-emas text-hutan-950' : 'text-kabut/70 hover:bg-kabut/10 hover:text-kabut'
                }`
              }
            >
              <span aria-hidden="true" className="text-base">{m.ikon}</span>
              {m.label}
            </NavLink>
          ))}
        </nav>
        <a href="/" className="m-3 rounded-xl border border-kabut/15 px-4 py-2.5 text-center text-xs font-semibold text-kabut/60 transition hover:text-kabut">
          ← Lihat Situs Publik
        </a>
      </aside>
    </>
  );
}
