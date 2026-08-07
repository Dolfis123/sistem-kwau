import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { reservasiApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import { STATUS_RESERVASI } from '../../constants';
import { formatTanggal, formatWaktu } from '../../utils/format';

export default function ManajemenReservasi() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [cari, setCari] = useState('');
  const { data, meta, loading, refetch } = useFetch(
    () => reservasiApi.list({ page, limit: 15, status: status || undefined, q: cari || undefined }),
    [page, status, cari]
  );
  const [detail, setDetail] = useState(null);
  const [proses, setProses] = useState(false);

  const ubahStatus = async (id, statusBaru) => {
    setProses(true);
    try {
      await reservasiApi.updateStatus(id, statusBaru);
      toast(`Status diubah menjadi "${STATUS_RESERVASI[statusBaru].label}".`);
      setDetail(null);
      refetch();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal mengubah status.', 'error');
    } finally { setProses(false); }
  };

  const unduhExcel = async () => {
    try {
      const res = await reservasiApi.exportExcel({ status: status || undefined });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = 'laporan-reservasi-kwau.xlsx'; a.click();
      URL.revokeObjectURL(url);
      toast('Laporan Excel diunduh.');
    } catch { toast('Gagal mengunduh laporan.', 'error'); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-hutan-950">Manajemen Reservasi</h1>
          <p className="mt-1 text-sm text-tinta/55">Verifikasi pembayaran manual, lalu perbarui status di sini.</p>
        </div>
        <button onClick={unduhExcel} className="btn-garis !px-5 !py-2.5 !text-xs">⬇ Export Excel</button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[['', 'Semua'], ...Object.entries(STATUS_RESERVASI).map(([v, s]) => [v, s.label])].map(([v, label]) => (
            <button key={v} onClick={() => { setStatus(v); setPage(1); }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${status === v ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 shadow-sm hover:bg-hutan-100'}`}>
              {label}
            </button>
          ))}
        </div>
        <form className="ml-auto flex gap-2" onSubmit={(e) => { e.preventDefault(); setCari(q); setPage(1); }}>
          <input className="input !w-48" placeholder="Cari nama turis..." value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn-hutan !px-4 !py-2 !text-xs">Cari</button>
        </form>
      </div>

      {loading ? <Loader /> : data?.length ? (
        <>
          <div className="mt-5 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-hutan-900/10 text-left text-[11px] font-bold uppercase tracking-wider text-tinta/50">
                  <th className="px-4 py-3">Turis</th>
                  <th className="px-4 py-3">Paket</th>
                  <th className="px-4 py-3">Tgl Kunjungan</th>
                  <th className="px-4 py-3">Peserta</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id} className="border-b border-hutan-900/5 last:border-0 hover:bg-hutan-50/60">
                    <td className="px-4 py-3">
                      <p className="font-bold text-hutan-950">{r.nama_turis}</p>
                      <p className="text-xs text-tinta/50">{r.no_wa}</p>
                    </td>
                    <td className="px-4 py-3 text-tinta/75">{r.paket?.nama || '-'}</td>
                    <td className="px-4 py-3 text-tinta/75">{formatTanggal(r.tanggal_kunjungan)}</td>
                    <td className="px-4 py-3 font-semibold text-tinta/75">{r.jumlah_peserta}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${STATUS_RESERVASI[r.status].cls}`}>
                        {STATUS_RESERVASI[r.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetail(r)} className="rounded-full bg-hutan-100 px-4 py-1.5 text-xs font-bold text-hutan-800 hover:bg-hutan-200">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination meta={meta} page={page} onPage={setPage} />
        </>
      ) : (
        <div className="mt-5"><EmptyState judul="Tidak ada reservasi" teks="Reservasi baru dari turis akan muncul di sini." /></div>
      )}

      <Modal buka={!!detail} onTutup={() => setDetail(null)} judul={`Reservasi #${detail?.id}`}>
        {detail && (
          <div className="space-y-3 text-sm">
            {[
              ['Nama turis', detail.nama_turis],
              ['No. WhatsApp', detail.no_wa],
              ['Paket', detail.paket?.nama],
              ['Tanggal kunjungan', formatTanggal(detail.tanggal_kunjungan)],
              ['Jumlah peserta', `${detail.jumlah_peserta} orang`],
              ['Catatan turis', detail.catatan || '—'],
              ['Dikirim', formatWaktu(detail.created_at)],
            ].map(([label, nilai]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-hutan-900/8 pb-2.5">
                <span className="text-tinta/50">{label}</span>
                <span className="text-right font-semibold text-hutan-950">{nilai}</span>
              </div>
            ))}
            <a href={`https://wa.me/${detail.no_wa.replace(/^0/, '62').replace('+', '')}`} target="_blank" rel="noreferrer"
              className="btn-garis w-full !py-2.5 !text-xs">💬 Hubungi Turis via WhatsApp</a>
            <div>
              <p className="label !mb-2">Ubah status</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_RESERVASI).filter(([v]) => v !== detail.status).map(([v, s]) => (
                  <button key={v} disabled={proses} onClick={() => ubahStatus(detail.id, v)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${s.cls} hover:opacity-80`}>
                    → {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-tinta/45">
                Menandai "Batal" otomatis mengembalikan kuota tanggal tersebut. Reservasi pending lebih dari 48 jam dibatalkan otomatis oleh sistem.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
