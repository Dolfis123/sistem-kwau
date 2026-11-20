import { Link } from 'react-router-dom';
import { Clock3, CheckCircle2, Images, Globe2, ArrowRight, CalendarCheck, Mountain, Newspaper, Sprout } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { dashboardApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import { formatWaktu } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function KartuStat({ to, Ikon, warna, label, nilai, ket }) {
  const isi = (
    <>
      <div className="flex items-center justify-between">
        <p className="admin-label">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${warna.bg}`}>
          <Ikon size={18} className={warna.teks} aria-hidden="true" />
        </span>
      </div>
      <p className={`mt-3 font-display text-4xl font-medium ${warna.teks}`}>{nilai ?? 0}</p>
      <p className="mt-1 text-xs text-tinta/50">{ket}</p>
    </>
  );
  const kelas = 'admin-panel block p-5 transition';
  return to
    ? <Link to={to} className={`${kelas} hover:-translate-y-0.5 hover:shadow-kartu`}>{isi}</Link>
    : <div className={kelas}>{isi}</div>;
}

// Pintasan sesuai role
const PINTASAN = [
  { to: '/admin/reservasi', label: 'Balas reservasi', Ikon: CalendarCheck, roles: ['admin_reservasi'] },
  { to: '/admin/paket', label: 'Kelola paket wisata', Ikon: Mountain, roles: ['admin_konten'] },
  { to: '/admin/moderasi', label: 'Tinjau kiriman galeri', Ikon: Images, roles: ['admin_konten'] },
  { to: '/admin/informasi', label: 'Tulis kabar kampung', Ikon: Newspaper, roles: ['pegawai_kampung', 'admin_pertanian'] },
  { to: '/admin/pertanian', label: 'Perbarui hasil kebun', Ikon: Sprout, roles: ['admin_pertanian'] },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const { data, loading, error } = useFetch(() => dashboardApi.ringkasan(), []);

  if (loading) return <Loader />;
  if (error) return <p className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>;

  const grafik = data?.grafik_bulanan || [];
  const maks = Math.max(...grafik.map((g) => Number(g.jumlah)), 1);
  const pintasan = PINTASAN.filter((p) => admin?.role === 'superadmin' || p.roles.includes(admin?.role));

  return (
    <div>
      <h1 className="admin-judul">Selamat datang, {admin?.nama?.split(' ')[0]}</h1>
      <p className="admin-sub">Ringkasan aktivitas Portal Wisata Kwau bulan ini.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <KartuStat to="/admin/reservasi" Ikon={Clock3} warna={{ bg: 'bg-amber-100', teks: 'text-amber-600' }}
          label="Pending" nilai={data?.reservasi_bulan_ini?.pending} ket="Menunggu verifikasi" />
        <KartuStat to="/admin/reservasi" Ikon={CheckCircle2} warna={{ bg: 'bg-emerald-100', teks: 'text-emerald-600' }}
          label="Lunas" nilai={data?.reservasi_bulan_ini?.lunas} ket="Sudah dikonfirmasi" />
        <KartuStat to="/admin/moderasi" Ikon={Images} warna={{ bg: 'bg-hutan-100', teks: 'text-hutan-700' }}
          label="Moderasi" nilai={data?.antrean_moderasi} ket="Kiriman menunggu tinjauan" />
        <KartuStat to="/admin/reservasi" Ikon={Globe2} warna={{ bg: 'bg-sky-100', teks: 'text-sky-700' }}
          label="Turis asing" nilai={data?.reservasi_bulan_ini?.bahasa_inggris} ket="Reservasi berbahasa Inggris" />
      </div>

      {pintasan.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {pintasan.map(({ to, label, Ikon }) => (
            <Link key={to} to={to} className="admin-aksi bg-white !px-4 !py-2.5 text-hutan-900 ring-1 ring-hutan-900/10 hover:bg-hutan-900 hover:text-kabut">
              <Ikon size={15} aria-hidden="true" /> {label}
            </Link>
          ))}
        </div>
      )}

      {/* Kelengkapan terjemahan: membantu admin tahu konten mana yang belum ada versi Inggrisnya */}
      {data?.terjemahan?.length > 0 && (
        <section className="admin-panel mt-6 p-5 sm:p-6">
          <h2 className="font-display text-lg font-medium text-hutan-950">Kelengkapan versi Bahasa Inggris</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-tinta/50">Sebagian besar pengunjung adalah turis mancanegara — konten berbahasa Inggris membantu mereka memesan.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.terjemahan.map((k) => {
              const sudah = k.total - k.belum;
              const persen = k.total ? Math.round((sudah / k.total) * 100) : 100;
              const penuh = persen === 100;
              return (
                <Link key={k.nama} to={k.menu} className="group rounded-xl bg-[#f7f5ef] p-4 transition hover:ring-1 hover:ring-hutan-900/20">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-bold text-hutan-950">{k.nama}</p>
                    <p className={`text-sm font-bold ${penuh ? 'text-emerald-600' : 'text-amber-600'}`}>{persen}%</p>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-hutan-900/10">
                    <div className={`h-full rounded-full ${penuh ? 'bg-emerald-500' : 'bg-emas'}`} style={{ width: `${persen}%` }} />
                  </div>
                  <p className="mt-2 flex items-center justify-between text-[11px] text-tinta/50">
                    {k.belum > 0 ? `${k.belum} dari ${k.total} belum diterjemahkan` : 'Semua sudah diterjemahkan'}
                    <ArrowRight size={13} className="opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="admin-panel p-5 sm:p-6">
          <h2 className="font-display text-lg font-medium text-hutan-950">Reservasi 6 bulan terakhir</h2>
          {grafik.length ? (
            <div className="mt-6 flex h-48 items-end gap-3">
              {grafik.map((g) => {
                const [th, bl] = g.bulan.split('-');
                return (
                  <div key={g.bulan} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <span className="text-xs font-bold text-hutan-800">{g.jumlah}</span>
                    <div className="w-full max-w-[56px] rounded-t-lg bg-gradient-to-t from-hutan-800 to-hutan-500"
                      style={{ height: `${Math.max((Number(g.jumlah) / maks) * 100, 4)}%` }} />
                    <span className="text-[10px] font-semibold text-tinta/45">{BULAN_PENDEK[Number(bl) - 1]} {th.slice(2)}</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="mt-4 text-sm text-tinta/50">Belum ada data reservasi.</p>}
        </section>

        <section className="admin-panel p-5 sm:p-6">
          <h2 className="font-display text-lg font-medium text-hutan-950">Aktivitas terbaru</h2>
          <ul className="mt-4 divide-y divide-hutan-900/[.06]">
            {(data?.aktivitas_terbaru || []).map((a, i) => (
              <li key={i} className="flex items-start gap-3 py-3 text-sm first:pt-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.tipe === 'reservasi' ? 'bg-emas' : 'bg-hutan-500'}`} />
                <div>
                  <p className="leading-snug text-tinta/80">{a.teks}</p>
                  <p className="mt-0.5 text-[11px] text-tinta/40">{formatWaktu(a.waktu)}</p>
                </div>
              </li>
            ))}
            {(!data?.aktivitas_terbaru || data.aktivitas_terbaru.length === 0) && (
              <p className="text-sm text-tinta/50">Belum ada aktivitas.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
