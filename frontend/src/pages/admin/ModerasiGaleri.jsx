import { useState } from 'react';
import { Check, Ban, Trash2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { galeriApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import ImgFallback from '../../components/common/ImgFallback';
import StarRating from '../../components/common/StarRating';
import { useToast } from '../../components/common/Toast';
import { formatWaktu } from '../../utils/format';

const TAB = [
  { value: 'pending', label: 'Antrean' },
  { value: 'approved', label: 'Tayang' },
  { value: 'rejected', label: 'Arsip Ditolak' },
];

export default function ModerasiGaleri() {
  const toast = useToast();
  const [tab, setTab] = useState('pending');
  const [page, setPage] = useState(1);
  const { data, meta, loading, refetch } = useFetch(() => galeriApi.antrean({ status: tab, page, limit: 12 }), [tab, page]);
  const [detail, setDetail] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [proses, setProses] = useState(false);

  const bukaDetail = async (id) => {
    try {
      const res = await galeriApi.detail(id);
      setDetail(res.data.data);
      setCatatan('');
    } catch { toast('Gagal memuat detail.', 'error'); }
  };

  const aksi = async (jenis) => {
    setProses(true);
    try {
      if (jenis === 'approve') await galeriApi.approve(detail.id, catatan);
      if (jenis === 'reject') await galeriApi.reject(detail.id, catatan);
      if (jenis === 'delete') await galeriApi.remove(detail.id);
      toast(jenis === 'approve' ? 'Konten disetujui & tayang.' : jenis === 'reject' ? 'Konten ditolak & diarsipkan.' : 'Konten dihapus permanen.');
      setDetail(null);
      refetch();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal memproses.', 'error');
    } finally { setProses(false); }
  };

  return (
    <div>
      <h1 className="admin-judul">Moderasi Jejak Wisatawan</h1>
      <p className="admin-sub">Tinjau kiriman pengunjung sebelum ditayangkan di halaman publik.</p>

      <div className="admin-tabs mt-5">
        {TAB.map((t) => (
          <button key={t.value} onClick={() => { setTab(t.value); setPage(1); }}
            className={`admin-tab ${tab === t.value ? 'admin-tab-aktif' : 'admin-tab-pasif'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : data?.length ? (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((g) => (
              <button key={g.id} onClick={() => bukaDetail(g.id)} className="admin-panel group overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-kartu">
                <div className="aspect-[16/10]">
                  <ImgFallback src={g.foto?.[0]?.url_foto} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-hutan-950">{g.nama_pengunjung}</p>
                    {g.rating && <StarRating nilai={g.rating} ukuran="text-xs" />}
                  </div>
                  <p className="text-[11px] text-tinta/45">{formatWaktu(g.created_at)}{g.paket ? ` · ${g.paket.nama}` : ''}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-tinta/70">{g.ulasan}</p>
                </div>
              </button>
            ))}
          </div>
          <Pagination meta={meta} page={page} onPage={setPage} />
        </>
      ) : (
        <div className="mt-5"><EmptyState judul={tab === 'pending' ? 'Antrean kosong — semua sudah ditinjau' : 'Belum ada konten'} /></div>
      )}

      <Modal buka={!!detail} onTutup={() => setDetail(null)} judul={`Kiriman dari ${detail?.nama_pengunjung}`} lebar="max-w-2xl">
        {detail && (
          <div>
            <div className={`grid gap-2 ${detail.foto?.length > 1 ? 'grid-cols-2' : ''}`}>
              {(detail.foto || []).map((f, i) => (
                <ImgFallback key={i} src={f.url_foto} alt="" className="max-h-72 w-full rounded-xl object-cover" />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-tinta/55">
              {detail.rating && <StarRating nilai={detail.rating} />}
              {detail.asal && <span>Asal: {detail.asal}</span>}
              {detail.kontak && <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800">Kontak internal: {detail.kontak}</span>}
              {detail.paket && <span>Paket: {detail.paket.nama}</span>}
            </div>
            <p className="mt-4 whitespace-pre-line rounded-xl bg-hutan-50 p-4 text-sm leading-relaxed text-tinta/80">{detail.ulasan}</p>

            {detail.riwayat?.length > 0 && (
              <div className="mt-4">
                <p className="label">Riwayat moderasi</p>
                <ul className="space-y-1 text-xs text-tinta/60">
                  {detail.riwayat.map((r) => (
                    <li key={r.id}>• {r.admin?.nama || 'Admin'} — <strong>{r.aksi}</strong> ({formatWaktu(r.created_at)}){r.catatan ? ` — "${r.catatan}"` : ''}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5">
              <label className="label" htmlFor="mod-catatan">Catatan (opsional, mis. alasan penolakan)</label>
              <input id="mod-catatan" className="input" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button disabled={proses || detail.status === 'approved'} onClick={() => aksi('approve')}
                className="btn !rounded-xl bg-emerald-600 !px-3 !py-2.5 !text-xs text-white hover:bg-emerald-700"><Check size={15} aria-hidden="true" /> Approve</button>
              <button disabled={proses || detail.status === 'rejected'} onClick={() => aksi('reject')}
                className="btn !rounded-xl bg-amber-500 !px-3 !py-2.5 !text-xs text-white hover:bg-amber-600"><Ban size={15} aria-hidden="true" /> Reject</button>
              <button disabled={proses} onClick={() => aksi('delete')}
                className="btn !rounded-xl bg-rose-600 !px-3 !py-2.5 !text-xs text-white hover:bg-rose-700"><Trash2 size={15} aria-hidden="true" /> Hapus</button>
            </div>
            <p className="mt-2 text-[11px] text-tinta/45">Approve = tayang di publik · Reject = diarsipkan (bisa ditinjau ulang) · Hapus = permanen.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
