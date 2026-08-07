import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { galeriApi, paketApi } from '../../../services/api';
import SectionHeading from '../../../components/common/SectionHeading';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import ImgFallback from '../../../components/common/ImgFallback';
import StarRating from '../../../components/common/StarRating';
import { useToast } from '../../../components/common/Toast';
import { formatTanggal } from '../../../utils/format';

export default function JejakWisatawan() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [paketId, setPaketId] = useState('');
  const { data: galeri, meta, loading, refetch } = useFetch(
    () => galeriApi.list({ page, limit: 12, paket_id: paketId || undefined }), [page, paketId]
  );
  const { data: paket } = useFetch(() => paketApi.list({ limit: 50 }), []);

  const [detail, setDetail] = useState(null);
  const [bukaForm, setBukaForm] = useState(false);
  const [kirim, setKirim] = useState(false);
  const [form, setForm] = useState({ nama_pengunjung: '', asal: '', kontak: '', ulasan: '', rating: 0, paket_wisata_id: '', setuju: false, website: '' });
  const [files, setFiles] = useState([]);

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const kirimPengalaman = async (e) => {
    e.preventDefault();
    if (!form.setuju) return toast('Anda harus menyetujui Syarat & Ketentuan.', 'error');
    setKirim(true);
    try {
      const fd = new FormData();
      fd.append('nama_pengunjung', form.nama_pengunjung || 'Anonim');
      if (form.asal) fd.append('asal', form.asal);
      if (form.kontak) fd.append('kontak', form.kontak);
      fd.append('ulasan', form.ulasan);
      if (form.rating) fd.append('rating', form.rating);
      if (form.paket_wisata_id) fd.append('paket_wisata_id', form.paket_wisata_id);
      fd.append('setuju_syarat', 'true');
      fd.append('website', form.website); // honeypot
      files.slice(0, 2).forEach((f) => fd.append('foto', f));
      await galeriApi.create(fd);
      toast('Terima kasih! Kiriman Anda akan tayang setelah ditinjau admin.');
      setBukaForm(false);
      setForm({ nama_pengunjung: '', asal: '', kontak: '', ulasan: '', rating: 0, paket_wisata_id: '', setuju: false, website: '' });
      setFiles([]);
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || 'Gagal mengirim.', 'error');
    } finally { setKirim(false); }
  };

  return (
    <div className="pt-16">
      <section className="bg-hutan-950 py-14 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <SectionHeading tengah gelap eyebrow="Jejak Wisatawan" judul="Cerita asli para pengunjung"
            teks="Semua konten di halaman ini dikirim oleh wisatawan dan ditayangkan setelah moderasi — bukti sosial yang jujur dan transparan." />
          <button onClick={() => setBukaForm(true)} className="btn-emas mt-7">+ Bagikan Pengalaman Anda</button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label htmlFor="filter-paket" className="text-sm font-bold text-hutan-900">Filter paket:</label>
          <select id="filter-paket" className="input !w-auto" value={paketId} onChange={(e) => { setPaketId(e.target.value); setPage(1); }}>
            <option value="">Semua paket</option>
            {(paket || []).map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>
        </div>

        {loading ? <Loader /> : galeri?.length ? (
          <>
            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
              {galeri.map((g) => (
                <button key={g.id} onClick={() => setDetail(g)} className="group block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-sm transition hover:shadow-kartu">
                  <ImgFallback src={g.foto?.[0]?.url_foto} alt={`Foto oleh ${g.nama_pengunjung}`} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-hutan-950">{g.nama_pengunjung}</p>
                      {g.rating && <StarRating nilai={g.rating} ukuran="text-xs" />}
                    </div>
                    <p className="text-[11px] text-tinta/45">{formatTanggal(g.created_at)}{g.asal ? ` · ${g.asal}` : ''}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tinta/70">{g.ulasan}</p>
                    <p className="mt-2 text-xs font-bold text-emas-dark">Baca selengkapnya →</p>
                  </div>
                </button>
              ))}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        ) : (
          <EmptyState judul="Belum ada cerita di sini" teks="Jadilah pengunjung pertama yang membagikan pengalamannya di Kwau!">
            <button onClick={() => setBukaForm(true)} className="btn-hutan">Bagikan Pengalaman</button>
          </EmptyState>
        )}
      </section>

      {/* Modal detail */}
      <Modal buka={!!detail} onTutup={() => setDetail(null)} judul={detail?.nama_pengunjung || ''} lebar="max-w-2xl">
        {detail && (
          <div>
            <div className={`grid gap-2 ${detail.foto?.length > 1 ? 'grid-cols-2' : ''}`}>
              {(detail.foto || []).map((f, i) => (
                <ImgFallback key={i} src={f.url_foto} alt="" className="max-h-80 w-full rounded-xl object-cover" />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {detail.rating && <StarRating nilai={detail.rating} />}
              {detail.paket && <span className="rounded-full bg-hutan-100 px-3 py-1 text-xs font-bold text-hutan-800">{detail.paket.nama}</span>}
              <span className="text-xs text-tinta/45">{formatTanggal(detail.created_at)}</span>
            </div>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-tinta/80">{detail.ulasan}</p>
          </div>
        )}
      </Modal>

      {/* Modal form kirim */}
      <Modal buka={bukaForm} onTutup={() => setBukaForm(false)} judul="Bagikan Pengalaman Anda">
        <form onSubmit={kirimPengalaman} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="ju-nama">Nama <span className="normal-case text-tinta/40">(boleh Anonim)</span></label>
              <input id="ju-nama" name="nama_pengunjung" className="input" placeholder="Anonim" value={form.nama_pengunjung} onChange={ubah} />
            </div>
            <div>
              <label className="label" htmlFor="ju-asal">Asal <span className="normal-case text-tinta/40">(opsional)</span></label>
              <input id="ju-asal" name="asal" className="input" placeholder="Kota / negara" value={form.asal} onChange={ubah} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="ju-kontak">Email / No. WA <span className="normal-case text-tinta/40">(hanya untuk verifikasi, tidak ditampilkan)</span></label>
            <input id="ju-kontak" name="kontak" className="input" value={form.kontak} onChange={ubah} />
          </div>
          <div>
            <label className="label" htmlFor="ju-paket">Paket yang diikuti <span className="normal-case text-tinta/40">(opsional)</span></label>
            <select id="ju-paket" name="paket_wisata_id" className="input" value={form.paket_wisata_id} onChange={ubah}>
              <option value="">— Pilih paket —</option>
              {(paket || []).map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ju-ulasan">Cerita / Ulasan Anda</label>
            <textarea id="ju-ulasan" name="ulasan" required minLength={10} rows={4} className="input resize-none" placeholder="Ceritakan pengalaman Anda di Kwau (minimal 10 karakter)..." value={form.ulasan} onChange={ubah} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="label !mb-1">Rating</span>
              <StarRating nilai={form.rating} onUbah={(n) => setForm({ ...form, rating: n })} ukuran="text-2xl" />
            </div>
            <div className="flex-1">
              <label className="label" htmlFor="ju-foto">Foto (maks. 2)</label>
              <input id="ju-foto" type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 2))}
                className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-hutan-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-hutan-800" />
            </div>
          </div>
          <input type="text" name="website" value={form.website} onChange={ubah} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="flex items-start gap-2.5 rounded-xl bg-hutan-100/60 p-3.5 text-xs leading-relaxed text-tinta/70">
            <input type="checkbox" checked={form.setuju} onChange={(e) => setForm({ ...form, setuju: e.target.checked })} className="mt-0.5 accent-emas" />
            <span>Saya menyetujui <strong>Syarat & Ketentuan</strong>: konten ditinjau admin sebelum tayang, dan pengelola berhak menghapus konten yang mengandung SARA, spam, atau tidak pantas.</span>
          </label>
          <button type="submit" disabled={kirim || !form.setuju} className="btn-emas w-full">
            {kirim ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
