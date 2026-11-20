import { useState } from 'react';
import { Plus } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import { galeriApi, paketApi } from '../../../services/api';
import PageHero from '../../../components/common/PageHero';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import ImgFallback from '../../../components/common/ImgFallback';
import StarRating from '../../../components/common/StarRating';
import { useToast } from '../../../components/common/Toast';
import { formatTanggal } from '../../../utils/format';
import { useLang } from '../../../i18n/LanguageContext';

const FORM_KOSONG = { nama_pengunjung: '', asal: '', kontak: '', ulasan: '', rating: 0, paket_wisata_id: '', setuju: false, website: '' };

export default function JejakWisatawan() {
  const toast = useToast();
  const { t, pick, locale } = useLang();
  const [page, setPage] = useState(1);
  const [paketId, setPaketId] = useState('');
  const { data: galeri, meta, loading } = useFetch(
    () => galeriApi.list({ page, limit: 12, paket_id: paketId || undefined }), [page, paketId]
  );
  const { data: paket } = useFetch(() => paketApi.list({ limit: 50 }), []);

  const [detail, setDetail] = useState(null);
  const [bukaForm, setBukaForm] = useState(false);
  const [kirim, setKirim] = useState(false);
  const [form, setForm] = useState(FORM_KOSONG);
  const [files, setFiles] = useState([]);

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const f = (k) => t(`jejak.form.${k}`);

  const kirimPengalaman = async (e) => {
    e.preventDefault();
    if (!form.setuju) return toast(f('harusSetuju'), 'error');
    setKirim(true);
    try {
      const fd = new FormData();
      fd.append('nama_pengunjung', form.nama_pengunjung || f('anonim'));
      if (form.asal) fd.append('asal', form.asal);
      if (form.kontak) fd.append('kontak', form.kontak);
      fd.append('ulasan', form.ulasan);
      if (form.rating) fd.append('rating', form.rating);
      if (form.paket_wisata_id) fd.append('paket_wisata_id', form.paket_wisata_id);
      fd.append('setuju_syarat', 'true');
      fd.append('website', form.website); // honeypot
      files.slice(0, 2).forEach((file) => fd.append('foto', file));
      await galeriApi.create(fd);
      toast(f('berhasil'));
      setBukaForm(false);
      setForm(FORM_KOSONG);
      setFiles([]);
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || f('gagal'), 'error');
    } finally { setKirim(false); }
  };

  return (
    <div>
      <PageHero eyebrow={t('jejak.eyebrow')} judul={t('jejak.judul')} teks={t('jejak.teks')}>
        <button onClick={() => setBukaForm(true)} className="btn-emas mt-9"><Plus size={17} aria-hidden="true" /> {t('jejak.bagikan')}</button>
      </PageHero>

      <section className="wadah py-14 lg:py-20">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <label htmlFor="filter-paket" className="text-sm font-bold text-hutan-900">{t('jejak.filterPaket')}:</label>
          <select id="filter-paket" className="input !w-auto !py-2.5" value={paketId} onChange={(e) => { setPaketId(e.target.value); setPage(1); }}>
            <option value="">{t('jejak.semuaPaket')}</option>
            {(paket || []).map((p) => <option key={p.id} value={p.id}>{pick(p, 'nama')}</option>)}
          </select>
        </div>

        {loading ? <Loader /> : galeri?.length ? (
          <>
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-5">
              {galeri.map((g) => (
                <button key={g.id} onClick={() => setDetail(g)} className="kartu group block w-full break-inside-avoid text-left transition hover:shadow-angkat">
                  {g.foto?.[0]?.url_foto && (
                    <div className="overflow-hidden">
                      <ImgFallback src={g.foto[0].url_foto} alt={t('beranda.jejak.fotoOleh', { nama: g.nama_pengunjung })} className="w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                    </div>
                  )}
                  <div className="p-5">
                    {g.rating ? <StarRating nilai={g.rating} ukuran="text-sm" /> : null}
                    <p className="mt-2 line-clamp-4 font-display text-[17px] leading-relaxed text-hutan-950">{g.ulasan}</p>
                    <p className="mt-4 text-sm font-bold text-hutan-900">{g.nama_pengunjung}</p>
                    <p className="text-[11px] text-tinta/45">{formatTanggal(g.created_at, locale)}{g.asal ? ` · ${g.asal}` : ''}</p>
                  </div>
                </button>
              ))}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        ) : (
          <EmptyState judul={t('jejak.kosongJudul')} teks={t('jejak.kosongTeks')}>
            <button onClick={() => setBukaForm(true)} className="btn-hutan">{t('jejak.bagikan')}</button>
          </EmptyState>
        )}
      </section>

      {/* Modal detail */}
      <Modal buka={!!detail} onTutup={() => setDetail(null)} judul={detail?.nama_pengunjung || ''} lebar="max-w-2xl">
        {detail && (
          <div>
            <div className={`grid gap-2 ${detail.foto?.length > 1 ? 'grid-cols-2' : ''}`}>
              {(detail.foto || []).map((foto, i) => (
                <ImgFallback key={i} src={foto.url_foto} alt="" className="max-h-80 w-full rounded-2xl object-cover" />
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {detail.rating ? <StarRating nilai={detail.rating} /> : null}
              {detail.paket && <span className="chip bg-hutan-100 text-hutan-800">{pick(detail.paket, 'nama')}</span>}
              <span className="text-xs text-tinta/45">{formatTanggal(detail.created_at, locale)}{detail.asal ? ` · ${detail.asal}` : ''}</span>
            </div>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-tinta/80">{detail.ulasan}</p>
          </div>
        )}
      </Modal>

      {/* Modal form kirim */}
      <Modal buka={bukaForm} onTutup={() => setBukaForm(false)} judul={f('judul')}>
        <form onSubmit={kirimPengalaman} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="ju-nama">{f('nama')} <span className="normal-case tracking-normal text-tinta/40">({f('namaKet')})</span></label>
              <input id="ju-nama" name="nama_pengunjung" className="input" placeholder={f('anonim')} value={form.nama_pengunjung} onChange={ubah} />
            </div>
            <div>
              <label className="label" htmlFor="ju-asal">{f('asal')} <span className="normal-case tracking-normal text-tinta/40">({t('umum.opsional')})</span></label>
              <input id="ju-asal" name="asal" className="input" placeholder={f('asalPh')} value={form.asal} onChange={ubah} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="ju-kontak">{f('kontak')} <span className="normal-case tracking-normal text-tinta/40">({f('kontakKet')})</span></label>
            <input id="ju-kontak" name="kontak" className="input" value={form.kontak} onChange={ubah} />
          </div>
          <div>
            <label className="label" htmlFor="ju-paket">{f('paket')} <span className="normal-case tracking-normal text-tinta/40">({t('umum.opsional')})</span></label>
            <select id="ju-paket" name="paket_wisata_id" className="input" value={form.paket_wisata_id} onChange={ubah}>
              <option value="">{f('pilihPaket')}</option>
              {(paket || []).map((p) => <option key={p.id} value={p.id}>{pick(p, 'nama')}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ju-ulasan">{f('ulasan')}</label>
            <textarea id="ju-ulasan" name="ulasan" required minLength={10} rows={4} className="input resize-none" placeholder={f('ulasanPh')} value={form.ulasan} onChange={ubah} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="label !mb-1">{f('rating')}</span>
              <StarRating nilai={form.rating} onUbah={(n) => setForm({ ...form, rating: n })} ukuran="text-2xl" />
            </div>
            <div className="flex-1">
              <label className="label" htmlFor="ju-foto">{f('foto')}</label>
              <input id="ju-foto" type="file" accept="image/jpeg,image/png,image/webp" multiple
                onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 2))}
                className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-hutan-100 file:px-4 file:py-2 file:text-xs file:font-bold file:text-hutan-800" />
            </div>
          </div>
          <input type="text" name="website" value={form.website} onChange={ubah} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="flex items-start gap-2.5 rounded-2xl bg-hutan-100/60 p-4 text-xs leading-relaxed text-tinta/70">
            <input type="checkbox" checked={form.setuju} onChange={(e) => setForm({ ...form, setuju: e.target.checked })} className="mt-0.5 accent-emas" />
            <span>{f('setuju')}</span>
          </label>
          <button type="submit" disabled={kirim || !form.setuju} className="btn-emas w-full">
            {kirim ? f('mengirim') : f('kirim')}
          </button>
        </form>
      </Modal>
    </div>
  );
}
