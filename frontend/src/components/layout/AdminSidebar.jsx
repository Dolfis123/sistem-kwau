import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Images, Mountain, BookOpen, MapPinned,
  Newspaper, Sprout, Mail, Users, Settings, ExternalLink, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

// Menu dikelompokkan sesuai tanggung jawab role masing-masing
const GRUP = [
  [null, [
    { to: '/admin', label: 'Dashboard', Ikon: LayoutDashboard, end: true, roles: null },
  ]],
  ['Wisata', [
    { to: '/admin/reservasi', label: 'Reservasi', Ikon: CalendarCheck, roles: ['admin_reservasi'] },
    { to: '/admin/moderasi', label: 'Moderasi Galeri', Ikon: Images, roles: ['admin_konten'] },
    { to: '/admin/paket', label: 'Paket Wisata', Ikon: Mountain, roles: ['admin_konten'] },
    { to: '/admin/konten', label: 'Konten Wisata', Ikon: BookOpen, roles: ['admin_konten'] },
    { to: '/admin/peta', label: 'Peta & Tokoh', Ikon: MapPinned, roles: ['admin_konten'] },
  ]],
  ['Kampung', [
    { to: '/admin/informasi', label: 'Informasi Kampung', Ikon: Newspaper, roles: ['pegawai_kampung', 'admin_pertanian'] },
    { to: '/admin/pertanian', label: 'Hasil Pertanian', Ikon: Sprout, roles: ['admin_pertanian'] },
  ]],
  ['Umum', [
    { to: '/admin/pesan', label: 'Pesan Kontak', Ikon: Mail, roles: ['admin_reservasi', 'admin_konten', 'pegawai_kampung'] },
    { to: '/admin/pengguna', label: 'Pengguna Admin', Ikon: Users, roles: [] }, // superadmin saja
    { to: '/admin/pengaturan', label: 'Pengaturan', Ikon: Settings, roles: null },
  ]],
];

// Dipakai juga oleh header untuk menampilkan judul halaman aktif
export const SEMUA_MENU = GRUP.flatMap(([, daftar]) => daftar);

export default function AdminSidebar({ buka, onTutup }) {
  const { admin } = useAuth();

  const bolehLihat = (roles) => {
    if (roles === null) return true; // semua role
    if (admin?.role === 'superadmin') return true;
    return roles.includes(admin?.role);
  };

  return (
    <>
      {buka && <div className="fixed inset-0 z-40 bg-hutan-950/60 backdrop-blur-sm lg:hidden" onClick={onTutup} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col bg-hutan-950 text-kabut transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${buka ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between gap-2.5 border-b border-white/[.08] px-5">
          <div className="flex items-center gap-3">
            <Logo ukuran="h-9 w-9" teksUkuran="text-base" />
            <div className="leading-tight">
              <p className="font-display text-[15px] font-medium">Portal Kwau</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-kabut/45">Dashboard Pengelola</p>
            </div>
          </div>
          <button onClick={onTutup} className="rounded-lg p-1.5 text-kabut/60 hover:bg-white/10 lg:hidden" aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Menu admin">
          {GRUP.map(([judul, daftar]) => {
            const terlihat = daftar.filter((m) => bolehLihat(m.roles));
            if (!terlihat.length) return null;
            return (
              <div key={judul || 'utama'} className="mb-4">
                {judul && <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-kabut/35">{judul}</p>}
                <div className="space-y-0.5">
                  {terlihat.map(({ to, label, Ikon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={onTutup}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                          isActive ? 'bg-emas text-hutan-950 shadow-[0_6px_18px_-8px_rgba(201,134,44,.8)]' : 'text-kabut/65 hover:bg-white/[.06] hover:text-kabut'
                        }`
                      }
                    >
                      <Ikon size={18} strokeWidth={1.8} aria-hidden="true" />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <a href="/" target="_blank" rel="noreferrer"
          className="m-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-kabut/55 transition hover:border-white/25 hover:text-kabut">
          <ExternalLink size={14} aria-hidden="true" /> Lihat Situs Publik
        </a>
      </aside>
    </>
  );
}
