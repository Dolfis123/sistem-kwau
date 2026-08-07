import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { dashboardApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import { formatWaktu } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { admin } = useAuth();
  const { data, loading, error } = useFetch(() => dashboardApi.ringkasan(), []);

  if (loading) return <Loader />;
  if (error) return <p className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>;

  const grafik = data?.grafik_bulanan || [];
  const maks = Math.max(...grafik.map((g) => Number(g.jumlah)), 1);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-hutan-950">Selamat datang, {admin?.nama?.split(' ')[0]} 👋</h1>
      <p className="mt-1 text-sm text-tinta/55">Ringkasan aktivitas Portal Wisata Kwau.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="kartu p-6">
          <p className="eyebrow">Reservasi Pending</p>
          <p className="mt-2 font-display text-4xl font-semibold text-amber-600">{data?.reservasi_bulan_ini?.pending ?? 0}</p>
          <p className="mt-1 text-xs text-tinta/50">bulan ini — menunggu verifikasi</p>
        </div>
        <div className="kartu p-6">
          <p className="eyebrow">Reservasi Lunas</p>
          <p className="mt-2 font-display text-4xl font-semibold text-emerald-600">{data?.reservasi_bulan_ini?.lunas ?? 0}</p>
          <p className="mt-1 text-xs text-tinta/50">bulan ini — sudah dikonfirmasi</p>
        </div>
        <Link to="/admin/moderasi" className="kartu p-6 transition hover:-translate-y-0.5">
          <p className="eyebrow">Antrean Moderasi</p>
          <p className="mt-2 font-display text-4xl font-semibold text-hutan-800">{data?.antrean_moderasi ?? 0}</p>
          <p className="mt-1 text-xs font-bold text-emas-dark">konten menunggu tinjauan →</p>
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="kartu p-6">
          <h2 className="font-display text-lg font-semibold text-hutan-950">Reservasi 6 Bulan Terakhir</h2>
          {grafik.length ? (
            <div className="mt-6 flex h-44 items-end gap-3">
              {grafik.map((g) => (
                <div key={g.bulan} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-bold text-hutan-800">{g.jumlah}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-hutan-800 to-hutan-500"
                    style={{ height: `${Math.max((Number(g.jumlah) / maks) * 100, 4)}%` }} />
                  <span className="text-[10px] font-semibold text-tinta/45">{g.bulan.slice(5)}/{g.bulan.slice(2, 4)}</span>
                </div>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-tinta/50">Belum ada data reservasi.</p>}
        </div>

        <div className="kartu p-6">
          <h2 className="font-display text-lg font-semibold text-hutan-950">Aktivitas Terbaru</h2>
          <ul className="mt-4 space-y-3">
            {(data?.aktivitas_terbaru || []).map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.tipe === 'reservasi' ? 'bg-emas' : 'bg-hutan-500'}`} />
                <div>
                  <p className="leading-snug text-tinta/80">{a.teks}</p>
                  <p className="text-[11px] text-tinta/40">{formatWaktu(a.waktu)}</p>
                </div>
              </li>
            ))}
            {(!data?.aktivitas_terbaru || data.aktivitas_terbaru.length === 0) && (
              <p className="text-sm text-tinta/50">Belum ada aktivitas.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
