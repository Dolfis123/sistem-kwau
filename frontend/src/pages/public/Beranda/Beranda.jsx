import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Users, MapPin, Quote } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import useKonten from '../../../hooks/useKonten';
import { paketApi, galeriApi, satwaApi, homestayApi, galeriKampungApi, beritaApi } from '../../../services/api';
import GarisKontur from '../../../components/common/GarisKontur';
import SectionHeading from '../../../components/common/SectionHeading';
import ImgFallback from '../../../components/common/ImgFallback';
import StarRating from '../../../components/common/StarRating';
import Modal from '../../../components/common/Modal';
import Ikon from '../../../components/common/Ikon';
import KartuPaket from '../PaketWisata/KartuPaket';
import { useLang } from '../../../i18n/LanguageContext';
import { formatTanggalPendek, hariIniWIT } from '../../../utils/format';

// Kotak "Cek ketersediaan" di hero → langsung ke form reservasi paket yang dipilih
function KotakPesan({ paket }) {
  const { t, pick } = useLang();
  const navigate = useNavigate();
  const [pilih, setPilih] = useState({ id: '', tanggal: '', peserta: 2 });

  const lanjut = (e) => {
    e.preventDefault();
    if (!pilih.id) return navigate('/paket-wisata');
    const q = new URLSearchParams();
    if (pilih.tanggal) q.set('tanggal', pilih.tanggal);
    if (pilih.peserta) q.set('peserta', pilih.peserta);
    navigate(`/paket-wisata/${pilih.id}?${q.toString()}#pesan`);
  };

  return (
    <form onSubmit={lanjut} className="grid gap-3 rounded-3xl bg-white p-3 shadow-angkat sm:grid-cols-[1.4fr_1fr_.8fr_auto] sm:items-end sm:gap-0 sm:p-2.5">
      <label className="block rounded-2xl px-4 py-2 sm:border-r sm:border-hutan-900/10">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-tinta/45"><MapPin size={12} aria-hidden="true" />{t('beranda.cari.paket')}</span>
        <select value={pilih.id} onChange={(e) => setPilih({ ...pilih, id: e.target.value })}
          className="mt-0.5 w-full bg-transparent text-sm font-semibold text-hutan-950 outline-none">
          <option value="">{t('beranda.cari.pilihPaket')}</option>
          {(paket || []).map((p) => <option key={p.id} value={p.id}>{pick(p, 'nama')}</option>)}
        </select>
      </label>
      <label className="block rounded-2xl px-4 py-2 sm:border-r sm:border-hutan-900/10">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-tinta/45"><CalendarDays size={12} aria-hidden="true" />{t('beranda.cari.tanggal')}</span>
        <input type="date" min={hariIniWIT()} value={pilih.tanggal} onChange={(e) => setPilih({ ...pilih, tanggal: e.target.value })}
          className="mt-0.5 w-full bg-transparent text-sm font-semibold text-hutan-950 outline-none" />
      </label>
      <label className="block rounded-2xl px-4 py-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-tinta/45"><Users size={12} aria-hidden="true" />{t('beranda.cari.peserta')}</span>
        <input type="number" min={1} max={100} value={pilih.peserta} onChange={(e) => setPilih({ ...pilih, peserta: e.target.value })}
          className="mt-0.5 w-full bg-transparent text-sm font-semibold text-hutan-950 outline-none" />
      </label>
      <button type="submit" className="btn-emas !rounded-2xl !py-4">
        {t('beranda.cari.tombol')} <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}

export default function Beranda() {
  const { t, pick, lang, locale } = useLang();
  const { data: paket } = useFetch(() => paketApi.list({ limit: 50 }), []);
  const { data: galeri } = useFetch(() => galeriApi.list({ limit: 6 }), []);
  const { data: satwa } = useFetch(() => satwaApi.list(), []);
  const { data: homestay } = useFetch(() => homestayApi.list(), []);
  const { data: pesona } = useFetch(() => galeriKampungApi.list({ page: 1, limit: 12 }), []);
  const { data: kabar } = useFetch(() => beritaApi.list({ limit: 3 }), []);
  const sekilas = useKonten('sekilas-kwau');
  const [lightbox, setLightbox] = useState(null);

  const testimoni = (galeri || []).filter((g) => g.rating >= 4).slice(0, 3);
  const fotoHero = pesona?.[0]?.url_foto || paket?.[0]?.foto_cover;
  const isiSekilas = lang === 'en'
    ? (sekilas?.isi_en || t('beranda.sekilas.bawaan'))
    : (sekilas?.isi || t('beranda.sekilas.bawaan'));

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-hutan-950 pb-10 pt-32 text-kabut">
        {fotoHero ? (
          <ImgFallback src={fotoHero} alt="" className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover" />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(12,31,23,.55)_0%,rgba(12,31,23,.35)_40%,rgba(12,31,23,.92)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_15%,rgba(201,134,44,.22),transparent_50%)]" />
        <GarisKontur className="absolute inset-x-0 bottom-0 -z-10 h-72 w-full text-emas/40" />

        <div className="wadah">
          <div className="max-w-4xl animate-muncul">
            <p className="eyebrow !text-emas-light">{t('beranda.lokasi')}</p>
            <h1 className="teks-bayangan mt-6 text-[2.75rem] font-medium leading-[1.02] sm:text-6xl lg:text-[5.25rem]">
              {t('beranda.judul1')} <em className="font-normal text-emas-light">{t('beranda.judulAksen')}</em> {t('beranda.judul2')}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-kabut/80 sm:text-lg">{t('beranda.sub')}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/paket-wisata" className="btn-emas">{t('beranda.ctaPaket')} <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link to="/peta" className="btn-terang">{t('beranda.ctaPeta')}</Link>
            </div>
          </div>

          <div className="mt-14 animate-muncul [animation-delay:.15s]">
            <p className="mb-3 text-xs font-bold uppercase tracking-lebar text-kabut/60">{t('beranda.cari.judul')}</p>
            <KotakPesan paket={paket} />
          </div>
        </div>
      </section>

      {/* ===== KEUNGGULAN ===== */}
      <section className="border-b border-hutan-900/[.07] bg-white">
        <div className="wadah grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {t('beranda.unggulan').map(([ikon, judul, teks]) => (
            <div key={judul} className="flex gap-4">
              <span className="ikon-bulat"><Ikon nama={ikon} size={22} /></span>
              <div>
                <p className="font-display text-lg font-medium leading-snug text-hutan-950">{judul}</p>
                <p className="mt-1 text-sm leading-relaxed text-tinta/60">{teks}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SEKILAS KWAU + STATISTIK ===== */}
      <section className="wadah bagian">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading eyebrow={t('beranda.sekilas.eyebrow')} judul={t('beranda.sekilas.judul')} />
            <p className="mt-6 whitespace-pre-line text-[17px] leading-relaxed text-tinta/75">{isiSekilas}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link to="/tentang" className="btn-hutan">{t('beranda.sekilas.ctaTentang')}</Link>
              <Link to="/tentang#peraturan-kampung" className="tautan">{t('beranda.sekilas.ctaPeraturan')} →</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [satwa?.length || '—', 0],
              [homestay?.length || '—', 1],
              [t('beranda.sekilas.jarak'), 2],
              ['100%', 3],
            ].map(([angka, i]) => (
              <div key={i} className={`rounded-3xl p-7 ${i === 0 ? 'bg-hutan-900 text-kabut' : i === 3 ? 'bg-emas/15' : 'bg-white ring-1 ring-hutan-900/[.07]'}`}>
                <p className={`font-display text-4xl font-medium sm:text-5xl ${i === 0 ? 'text-emas-light' : 'text-hutan-900'}`}>{angka}</p>
                <p className={`mt-2 text-sm font-medium ${i === 0 ? 'text-kabut/70' : 'text-tinta/60'}`}>{t('beranda.sekilas.stat')[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PAKET UNGGULAN ===== */}
      <section className="relative isolate overflow-hidden bg-hutan-950 py-20 lg:py-28">
        <GarisKontur className="absolute inset-x-0 top-0 -z-10 h-40 w-full text-kabut/20" />
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading gelap eyebrow={t('beranda.paket.eyebrow')} judul={t('beranda.paket.judul')} teks={t('beranda.paket.teks')} />
            <Link to="/paket-wisata" className="btn-terang">{t('beranda.paket.semua')} <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(paket || []).slice(0, 3).map((p) => <KartuPaket key={p.id} paket={p} gelap />)}
            {(!paket || paket.length === 0) && <p className="text-kabut/60">{t('beranda.paket.kosong')}</p>}
          </div>
        </div>
      </section>

      {/* ===== DAMPAK BAGI KAMPUNG ===== */}
      <section className="wadah bagian">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-center">
          <div>
            <SectionHeading eyebrow={t('beranda.dampak.eyebrow')} judul={t('beranda.dampak.judul')} teks={t('beranda.dampak.teks')} />
            <Link to="/pertanian" className="btn-garis mt-8">{t('beranda.dampak.ctaKebun')} <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t('beranda.dampak.item').map(([ikon, judul, teks], i) => (
              <div key={judul} className={`rounded-3xl p-7 ${i % 3 === 0 ? 'bg-white shadow-kartu ring-1 ring-hutan-900/[.06]' : 'bg-krem/70'}`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emas/15 text-emas-dark"><Ikon nama={ikon} size={21} /></span>
                <p className="mt-5 font-display text-xl font-medium text-hutan-950">{judul}</p>
                <p className="mt-2 text-sm leading-relaxed text-tinta/65">{teks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PESONA KWAU ===== */}
      {pesona?.length > 0 && (
        <section className="pb-20 lg:pb-28">
          <div className="wadah">
            <SectionHeading eyebrow={t('beranda.pesona.eyebrow')} judul={t('beranda.pesona.judul')} teks={t('beranda.pesona.teks')} />
          </div>
          <div className="tanpa-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] [-webkit-overflow-scrolling:touch]">
            {pesona.map((f) => {
              const judul = pick(f, 'judul');
              return (
                <button key={f.id} onClick={() => setLightbox(f)}
                  className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-3xl sm:w-80" aria-label={t('beranda.pesona.perbesar', { judul })}>
                  <ImgFallback src={f.url_foto} alt={judul} className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hutan-950/90 to-transparent px-5 pb-5 pt-16 text-left font-display text-lg text-kabut">
                    {judul}
                  </span>
                </button>
              );
            })}
          </div>
          <Modal buka={!!lightbox} onTutup={() => setLightbox(null)} judul={lightbox ? pick(lightbox, 'judul') : ''} lebar="max-w-4xl">
            {lightbox && <ImgFallback src={lightbox.url_foto} alt={pick(lightbox, 'judul')} className="max-h-[72vh] w-full rounded-2xl object-contain" />}
          </Modal>
        </section>
      )}

      {/* ===== CERITA PENGUNJUNG ===== */}
      <section className="bg-white py-20 lg:py-28">
        <div className="wadah">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t('beranda.jejak.eyebrow')} judul={t('beranda.jejak.judul')} teks={t('beranda.jejak.teks')} />
            <Link to="/jejak-wisatawan" className="btn-garis">{t('umum.lihatSemua')}</Link>
          </div>

          {testimoni.length > 0 && (
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimoni.map((g) => (
                <figure key={g.id} className="flex flex-col rounded-3xl bg-kabut p-7 ring-1 ring-hutan-900/[.06]">
                  <Quote size={28} className="text-emas" aria-hidden="true" />
                  <blockquote className="mt-4 line-clamp-5 flex-1 font-display text-lg leading-relaxed text-hutan-950">{g.ulasan}</blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-hutan-900/[.08] pt-5">
                    <span className="text-sm font-bold text-hutan-900">{g.nama_pengunjung}{g.asal ? <span className="font-medium text-tinta/50"> · {g.asal}</span> : ''}</span>
                    <StarRating nilai={g.rating} ukuran="text-sm" />
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {galeri?.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {galeri.slice(0, 6).map((g) => (
                <Link key={g.id} to="/jejak-wisatawan" className="group relative aspect-square overflow-hidden rounded-2xl">
                  <ImgFallback src={g.foto?.[0]?.url_foto} alt={t('beranda.jejak.fotoOleh', { nama: g.nama_pengunjung })} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-tinta/50">{t('beranda.jejak.kosong')}</p>
          )}
        </div>
      </section>

      {/* ===== KABAR TERBARU ===== */}
      {kabar?.length > 0 && (
        <section className="wadah bagian">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t('beranda.kabar.eyebrow')} judul={t('beranda.kabar.judul')} />
            <Link to="/informasi" className="tautan">{t('info.semuaInfo')} →</Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {kabar.map((b) => (
              <Link key={b.id} to={`/informasi/${b.id}`} className="group">
                <div className="aspect-[16/10] overflow-hidden rounded-3xl">
                  <ImgFallback src={b.foto_sampul} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-emas-dark">
                  {t(`kategoriBerita.${b.kategori}`)} · <span className="text-tinta/45">{formatTanggalPendek(b.tanggal_terbit, locale)}</span>
                </p>
                <h3 className="mt-2 font-display text-xl font-medium leading-snug text-hutan-950 transition group-hover:text-hutan-700">{pick(b, 'judul')}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== AJAKAN BERBAGI ===== */}
      <section className="wadah pb-24">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-hutan-900 px-6 py-16 text-center sm:px-12 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,134,44,.25),transparent_60%)]" />
          <GarisKontur className="absolute inset-x-0 bottom-0 -z-10 h-32 w-full text-emas/50" />
          <h2 className="mx-auto max-w-xl text-3xl font-medium text-kabut sm:text-5xl">{t('beranda.ajakan.judul')}</h2>
          <p className="mx-auto mt-4 max-w-lg text-kabut/70">{t('beranda.ajakan.teks')}</p>
          <Link to="/jejak-wisatawan" className="btn-emas mt-9">{t('beranda.ajakan.tombol')}</Link>
        </div>
      </section>
    </>
  );
}
