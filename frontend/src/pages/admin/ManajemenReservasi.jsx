import { useState } from 'react';
import { Download, Search, CalendarDays, Users, MessageCircle, Globe2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { reservasiApi } from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { IkonWA } from '../../components/common/Ikon';
import { useToast } from '../../components/common/Toast';
import { STATUS_RESERVASI } from '../../constants';
import { TEMPLATE_BALASAN } from '../../constants/templateBalasan';
import { formatTanggal, formatWaktu, nomorWaMe } from '../../utils/format';

function LencanaBahasa({ bahasa, negara }) {
  if (bahasa !== 'en') return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800" title="Turis memesan dalam bahasa Inggris">
      <Globe2 size={11} aria-hidden="true" /> EN{negara ? ` · ${negara}` : ''}
    </span>
  );
}

// Panel balasan WhatsApp siap kirim (Inggris / Indonesia)
function BalasanWA({ r }) {
  const toast = useToast();
  const [bahasa, setBahasa] = useState(r.bahasa === 'en' ? 'en' : 'id');
  const [pilih, setPilih] = useState(TEMPLATE_BALASAN[0].kode);
  const tpl = TEMPLATE_BALASAN.find((x) => x.kode === pilih);
  const namaPaket = (bahasa === 'en' && r.paket?.nama_en) || r.paket?.nama || '-';
  const data = { ...r, paket: namaPaket, situs: window.location.origin };
  const teks = tpl[bahasa](data);
  const href = `https://wa.me/${nomorWaMe(r.no_wa)}?text=${encodeURIComponent(teks)}`;

  const salin = async () => {
    try { await navigator.clipboard.writeText(teks); toast('Teks pesan disalin.'); }
    catch { toast('Gagal menyalin — pilih teks secara manual.', 'error'); }
  };

  return (
    <div className="rounded-2xl bg-hutan-50 p-4 ring-1 ring-hutan-900/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label !mb-0">Balas turis via WhatsApp</p>
        <div className="flex gap-1">
          {[['en', 'English'], ['id', 'Indonesia']].map(([v, l]) => (
            <button key={v} type="button" onClick={() => setBahasa(v)}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${bahasa === v ? 'bg-hutan-900 text-kabut' : 'bg-white text-hutan-900 ring-1 ring-hutan-900/15'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TEMPLATE_BALASAN.map((x) => (
          <button key={x.kode} type="button" onClick={() => setPilih(x.kode)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${pilih === x.kode ? 'bg-emas text-hutan-950' : 'bg-white text-tinta/70 ring-1 ring-hutan-900/10 hover:ring-hutan-900/30'}`}>
            {x.judul}
          </button>
        ))}
      </div>
      <pre className="mt-3 max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-3.5 font-sans text-xs leading-relaxed text-tinta/80 ring-1 ring-hutan-900/10">{teks}</pre>
      {bahasa === 'en' && (
        <p className="mt-2 rounded-lg bg-sky-50 px-3 py-2 text-[11px] leading-relaxed text-sky-900/80">
          <strong>Artinya:</strong> {tpl.arti}
        </p>
      )}
      {tpl.isian && (
        <p className="mt-2 text-[11px] font-semibold text-amber-700">⚠ Ganti bagian [....] di WhatsApp sebelum menekan kirim.</p>
      )}
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <a href={href} target="_blank" rel="noreferrer" className="btn-wa !py-2.5 !text-xs"><IkonWA size={15} /> Buka di WhatsApp</a>
        <button type="button" onClick={salin} className="btn-garis !px-4 !py-2.5 !text-xs">Salin</button>
      </div>
    </div>
  );
}

export default function ManajemenReservasi() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [bahasa, setBahasa] = useState('');
  const [q, setQ] = useState('');
  const [cari, setCari] = useState('');
  const { data, meta, loading, refetch } = useFetch(
    () => reservasiApi.list({ page, limit: 15, status: status || undefined, bahasa: bahasa || undefined, q: cari || undefined }),
    [page, status, bahasa, cari]
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

  const kelasFilter = (aktif) => `admin-tab ${aktif ? 'admin-tab-aktif' : 'admin-tab-pasif'}`;
  const statusLabel = (s) => STATUS_RESERVASI[s] || { label: s, cls: 'bg-hutan-100 text-hutan-800' };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="admin-judul">Manajemen Reservasi</h1>
          <p className="admin-sub">Balas turis lewat template WhatsApp, verifikasi pembayaran manual, lalu perbarui status di sini.</p>
        </div>
        <button onClick={unduhExcel} className="btn-garis !px-5 !py-2.5 !text-xs"><Download size={15} aria-hidden="true" /> Export Excel</button>
      </div>

      <div className="mt-6 space-y-3">
        <div className="admin-tabs">
          {[['', 'Semua status'], ...Object.entries(STATUS_RESERVASI).map(([v, s]) => [v, s.label])].map(([v, label]) => (
            <button key={v} onClick={() => { setStatus(v); setPage(1); }} className={kelasFilter(status === v)}>{label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="admin-tabs flex-1">
            {[['', 'Semua bahasa'], ['en', 'Turis berbahasa Inggris'], ['id', 'Bahasa Indonesia']].map(([v, label]) => (
              <button key={`b-${v}`} onClick={() => { setBahasa(v); setPage(1); }} className={kelasFilter(bahasa === v)}>{label}</button>
            ))}
          </div>
          <form className="flex w-full gap-2 sm:w-auto" onSubmit={(e) => { e.preventDefault(); setCari(q); setPage(1); }}>
            <div className="relative flex-1 sm:w-56 sm:flex-none">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta/35" aria-hidden="true" />
              <input className="input !py-2.5 !pl-10" placeholder="Cari nama turis..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <button className="btn-hutan !px-4 !py-2 !text-xs">Cari</button>
          </form>
        </div>
      </div>

      {loading ? <Loader /> : data?.length ? (
        <>
          {/* HP, tablet, laptop kecil: daftar kartu */}
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:hidden">
            {data.map((r) => (
              <article key={r.id} className="admin-panel flex flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 font-bold text-hutan-950">{r.nama_turis} <LencanaBahasa bahasa={r.bahasa} negara={r.negara} /></p>
                    <p className="mt-0.5 text-xs text-tinta/50">#{r.id} · +{nomorWaMe(r.no_wa)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusLabel(r.status).cls}`}>{statusLabel(r.status).label}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-tinta/80">{r.paket?.nama || '-'}</p>
                <p className="mb-4 mt-1 flex flex-wrap gap-x-4 text-xs text-tinta/55">
                  <span className="inline-flex items-center gap-1"><CalendarDays size={13} aria-hidden="true" /> {formatTanggal(r.tanggal_kunjungan)}</span>
                  <span className="inline-flex items-center gap-1"><Users size={13} aria-hidden="true" /> {r.jumlah_peserta} orang</span>
                </p>
                <button onClick={() => setDetail(r)} className="btn-hutan mt-auto w-full !py-2.5 !text-xs">
                  <MessageCircle size={15} aria-hidden="true" /> Detail & Balas via WhatsApp
                </button>
              </article>
            ))}
          </div>

          {/* Desktop: tabel */}
          <div className="admin-panel mt-5 hidden overflow-x-auto xl:block">
            <table className="w-full text-sm">
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
                      <p className="flex flex-wrap items-center gap-1.5 font-bold text-hutan-950">{r.nama_turis} <LencanaBahasa bahasa={r.bahasa} negara={r.negara} /></p>
                      <p className="text-xs text-tinta/50">+{nomorWaMe(r.no_wa)}</p>
                    </td>
                    <td className="px-4 py-3 text-tinta/75">{r.paket?.nama || '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-tinta/75">{formatTanggal(r.tanggal_kunjungan)}</td>
                    <td className="px-4 py-3 font-semibold text-tinta/75">{r.jumlah_peserta}</td>
                    <td className="px-4 py-3">
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold ${statusLabel(r.status).cls}`}>
                        {statusLabel(r.status).label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDetail(r)} className="admin-aksi whitespace-nowrap bg-hutan-900 text-kabut hover:bg-hutan-800">
                        <MessageCircle size={14} aria-hidden="true" /> Detail & Balas
                      </button>
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

      <Modal buka={!!detail} onTutup={() => setDetail(null)} judul={`Reservasi #${detail?.id}`} lebar="max-w-2xl">
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="space-y-2.5">
              {[
                ['Nama turis', <span key="n" className="inline-flex items-center gap-1.5">{detail.nama_turis} <LencanaBahasa bahasa={detail.bahasa} /></span>],
                ['Negara asal', detail.negara || '—'],
                ['No. WhatsApp', `+${nomorWaMe(detail.no_wa)}`],
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
            </div>

            <BalasanWA r={detail} />

            <div>
              <p className="label !mb-2">Ubah status</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
