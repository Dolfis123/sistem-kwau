import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, CalendarX, CheckCircle2, ShieldCheck, MessagesSquare, Languages } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import usePengaturan, { linkWa } from '../../../hooks/usePengaturan';
import { paketApi, reservasiApi } from '../../../services/api';
import Loader from '../../../components/common/Loader';
import ImgFallback from '../../../components/common/ImgFallback';
import { IkonWA } from '../../../components/common/Ikon';
import { useToast } from '../../../components/common/Toast';
import { formatTanggalPendek, hariIniWIT } from '../../../utils/format';
import { useLang } from '../../../i18n/LanguageContext';

export default function DetailPaket() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const toast = useToast();
  const { t, pick, lang, locale, belumDiterjemahkan } = useLang();
  const { data: paket, loading } = useFetch(() => paketApi.detail(id), [id]);
  const pengaturan = usePengaturan();
  const [fotoAktif, setFotoAktif] = useState(0);
  const [kirim, setKirim] = useState(false);
  const [sukses, setSukses] = useState(null);
  const [form, setForm] = useState({
    nama_turis: '', no_wa: '', negara: '', catatan: '', website: '',
    jumlah_peserta: params.get('peserta') || 1,
    tanggal_kunjungan: params.get('tanggal') || '',
  });

  const semuaFoto = useMemo(() => {
    if (!paket) return [];
    return [paket.foto_cover, ...(paket.foto || []).map((f) => f.url_foto)].filter(Boolean);
  }, [paket]);

  // Tanggal yang penuh/ditutup → ditandai di info ketersediaan
  const slotBermasalah = useMemo(
    () => (paket?.ketersediaan || []).filter((k) => k.status !== 'tersedia' || k.kuota_tersedia === 0),
    [paket]
  );

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!paket) return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 pt-24">
      <p className="text-tinta/60">{t('detail.tidakAda')}</p>
      <Link to="/paket-wisata" className="btn-hutan">{t('detail.kembaliDaftar')}</Link>
    </div>
  );

  const nama = pick(paket, 'nama');
  const durasi = pick(paket, 'durasi');
  const tanggalBermasalah = slotBermasalah.some((k) => k.tanggal === form.tanggal_kunjungan);
  const waHarga = linkWa(pengaturan.wa_utama, t('wa.tanyaHargaPaket', { paket: nama }));
  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pesan = async (e) => {
    e.preventDefault();
    setKirim(true);
    try {
      const res = await reservasiApi.create({ ...form, paket_wisata_id: paket.id, bahasa: lang });
      const waLink = res.data.data?.wa_link;
      setSukses({ wa: waLink, kode: res.data.data?.reservasi?.id });
      toast(t('detail.berhasilToast'));
      if (waLink) window.open(waLink, '_blank', 'noopener');
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors?.[0]?.pesan || err.response?.data?.message || t('detail.gagal'), 'error');
    } finally { setKirim(false); }
  };

  return (
    <div className="pt-[72px]">
      {/* Galeri utama */}
      <section className="bg-hutan-950">
        <div className="wadah pb-6 pt-8">
          <Link to="/paket-wisata" className="inline-flex items-center gap-1.5 text-sm font-semibold text-kabut/70 transition hover:text-emas-light">
            <ArrowLeft size={16} aria-hidden="true" /> {t('detail.semuaPaket')}
          </Link>
          <div className="mt-5 overflow-hidden rounded-3xl">
            <div className="aspect-[16/9] max-h-[560px] w-full lg:aspect-[21/9]">
              <ImgFallback src={semuaFoto[fotoAktif]} alt={nama} className="h-full w-full object-cover" />
            </div>
          </div>
          {semuaFoto.length > 1 && (
            <div className="tanpa-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {semuaFoto.map((f, i) => (
                <button key={i} onClick={() => setFotoAktif(i)} aria-label={t('detail.foto', { n: i + 1 })}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 transition ${i === fotoAktif ? 'ring-emas' : 'opacity-60 ring-transparent hover:opacity-100'}`}>
                  <ImgFallback src={f} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="wadah py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr]">
          {/* Kiri: deskripsi */}
          <div>
            <span className="chip bg-emas/15 text-emas-dark">{t(`kategoriPaket.${paket.kategori}`)}</span>
            <h1 className="mt-4 text-4xl font-medium leading-tight text-hutan-950 sm:text-5xl">{nama}</h1>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-tinta/60">
              {durasi && <span className="inline-flex items-center gap-2"><Clock size={17} aria-hidden="true" /> {durasi}</span>}
              <span className="inline-flex items-center gap-2"><Users size={17} aria-hidden="true" /> {t('detail.maksJadwal', { n: paket.kapasitas })}</span>
            </div>
            {belumDiterjemahkan(paket, 'deskripsi') && (
              <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emas/10 px-3 py-1 text-[11px] font-semibold text-emas-dark">
                <Languages size={13} aria-hidden="true" /> {t('umum.hanyaIndonesia')}
              </p>
            )}
            <p className="mt-7 whitespace-pre-line text-[17px] leading-relaxed text-tinta/80">{pick(paket, 'deskripsi')}</p>

            {pick(paket, 'itinerary') && (
              <div className="mt-10 rounded-3xl bg-white p-7 shadow-kartu ring-1 ring-hutan-900/[.06] sm:p-8">
                <h2 className="font-display text-2xl font-medium text-hutan-950">{t('detail.itinerary')}</h2>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-tinta/80">{pick(paket, 'itinerary')}</p>
              </div>
            )}

            {slotBermasalah.length > 0 && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 font-display text-xl font-medium text-hutan-950">
                  <CalendarX size={20} className="text-rose-600" aria-hidden="true" /> {t('detail.tanggalPenuh')}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {slotBermasalah.map((k) => (
                    <span key={k.tanggal} className="rounded-full bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
                      {formatTanggalPendek(k.tanggal, locale)}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-tinta/50">{t('detail.tanggalLain')}</p>
              </div>
            )}
          </div>

          {/* Kanan: form reservasi */}
          <aside id="pesan" className="scroll-mt-24">
            <div className="kartu sticky top-24 p-6 sm:p-7">
              <div className="rounded-2xl bg-emas/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emas-dark">{t('detail.infoHarga')}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-tinta/75">{t('detail.infoHargaTeks')}</p>
                {waHarga && (
                  <a href={waHarga} target="_blank" rel="noreferrer" className="btn-wa mt-4 w-full !py-2.5 !text-xs">
                    <IkonWA size={16} /> {t('detail.tanyaHargaWa')}
                  </a>
                )}
              </div>

              {sukses ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 p-6 text-center ring-1 ring-emerald-200">
                  <CheckCircle2 size={40} className="mx-auto text-emerald-600" aria-hidden="true" />
                  <p className="mt-3 font-display text-xl font-medium text-emerald-950">{t('detail.suksesJudul')}</p>
                  {sukses.kode && <p className="mt-1 text-sm font-bold text-emerald-800">{t('detail.suksesKode', { kode: sukses.kode })}</p>}
                  <p className="mt-2 text-sm leading-relaxed text-emerald-900/75">{t('detail.suksesTeks')}</p>
                  {sukses.wa && (
                    <a href={sukses.wa} target="_blank" rel="noreferrer" className="btn-wa mt-5 w-full"><IkonWA size={18} /> {t('detail.bukaWa')}</a>
                  )}
                </div>
              ) : (
                <form onSubmit={pesan} className="mt-6 space-y-4">
                  <h2 className="font-display text-2xl font-medium text-hutan-950">{t('detail.formJudul')}</h2>
                  <div>
                    <label className="label" htmlFor="nama_turis">{t('detail.nama')}</label>
                    <input id="nama_turis" name="nama_turis" required minLength={2} autoComplete="name" className="input" placeholder={t('detail.namaPh')} value={form.nama_turis} onChange={ubah} />
                  </div>
                  <div>
                    <label className="label" htmlFor="no_wa">{t('detail.wa')}</label>
                    <input id="no_wa" name="no_wa" required type="tel" inputMode="tel" autoComplete="tel" className="input" placeholder={t('detail.waPh')} value={form.no_wa} onChange={ubah} />
                    <p className="mt-1.5 text-[11px] leading-relaxed text-tinta/50">{t('detail.waKet')}</p>
                  </div>
                  <div>
                    <label className="label" htmlFor="negara">{t('detail.negara')} <span className="normal-case tracking-normal text-tinta/40">({t('umum.opsional')})</span></label>
                    <input id="negara" name="negara" maxLength={60} autoComplete="country-name" className="input" placeholder={t('detail.negaraPh')} value={form.negara} onChange={ubah} />
                  </div>
                  <div className="grid grid-cols-[.8fr_1.2fr] gap-3">
                    <div>
                      <label className="label" htmlFor="jumlah_peserta">{t('detail.peserta')}</label>
                      <input id="jumlah_peserta" name="jumlah_peserta" type="number" min={1} max={paket.kapasitas} required className="input" value={form.jumlah_peserta} onChange={ubah} />
                    </div>
                    <div>
                      <label className="label" htmlFor="tanggal_kunjungan">{t('detail.tanggal')}</label>
                      <input id="tanggal_kunjungan" name="tanggal_kunjungan" type="date" required min={hariIniWIT()} className={`input ${tanggalBermasalah ? '!border-rose-400' : ''}`} value={form.tanggal_kunjungan} onChange={ubah} />
                    </div>
                  </div>
                  {tanggalBermasalah && <p className="-mt-1 text-xs font-semibold text-rose-600">{t('detail.tanggalPenuh')}</p>}
                  <div>
                    <label className="label" htmlFor="catatan">{t('detail.catatan')} <span className="normal-case tracking-normal text-tinta/40">({t('umum.opsional')})</span></label>
                    <textarea id="catatan" name="catatan" rows={3} className="input resize-none" placeholder={t('detail.catatanPh')} value={form.catatan} onChange={ubah} />
                  </div>
                  {/* Honeypot anti-bot: tidak terlihat oleh manusia */}
                  <input type="text" name="website" value={form.website} onChange={ubah} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <button type="submit" disabled={kirim} className="btn-emas w-full !py-3.5">
                    {kirim ? t('detail.mengirim') : t('detail.kirim')}
                  </button>
                  <ul className="space-y-1.5 text-xs font-semibold text-tinta/55">
                    <li className="flex items-center gap-2"><ShieldCheck size={15} className="text-hutan-600" aria-hidden="true" /> {t('detail.tanpaBayarOnline')}</li>
                    <li className="flex items-center gap-2"><MessagesSquare size={15} className="text-hutan-600" aria-hidden="true" /> {t('detail.dibalasWarga')}</li>
                  </ul>
                  <p className="text-center text-[11px] leading-relaxed text-tinta/45">
                    {t('detail.setelahKirim')}{' '}
                    <Link to="/tentang#peraturan-kampung" className="font-bold text-hutan-700 underline decoration-emas decoration-2 underline-offset-2">
                      {t('detail.peraturan')}
                    </Link>.
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
