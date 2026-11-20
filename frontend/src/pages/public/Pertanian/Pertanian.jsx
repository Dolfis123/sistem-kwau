// Halaman Hasil Kebun — potensi kebun yang bisa dibeli wisatawan langsung dari petani,
// lengkap dengan kalender bulan panen dan frekuensi panen per tahun.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Tag, Wheat } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import usePengaturan, { linkWa } from '../../../hooks/usePengaturan';
import { pertanianApi } from '../../../services/api';
import PageHero from '../../../components/common/PageHero';
import Loader from '../../../components/common/Loader';
import Pagination from '../../../components/common/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import ImgFallback from '../../../components/common/ImgFallback';
import { IkonWA } from '../../../components/common/Ikon';
import { KATEGORI_PERTANIAN, BULAN } from '../../../constants';
import { useLang } from '../../../i18n/LanguageContext';

// Menandai bulan panen dari teks admin (Bahasa Indonesia), mis. "Mei – September" atau "Februari, Juni, Oktober"
function bulanPanen(teks = '') {
  const t = teks.toLowerCase();
  if (/sepanjang|setiap|hampir/.test(t)) return BULAN.map((_, i) => i);
  const ada = BULAN.map((b, i) => (t.includes(b.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
  if (ada.length === 2 && /[–-]/.test(t)) {
    const [a, b] = ada;
    return Array.from({ length: b - a + 1 }, (_, k) => a + k);
  }
  return ada;
}

export default function Pertanian() {
  const { t, pick, locale } = useLang();
  const [kategori, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const { data, meta, loading } = useFetch(
    () => pertanianApi.list({ page, limit: 12, kategori: kategori || undefined }), [kategori, page]
  );
  const pengaturan = usePengaturan();
  const waPertanian = pengaturan.wa_pertanian || pengaturan.wa_utama;
  const namaBulan = useMemo(
    () => BULAN.map((_, i) => new Date(2026, i, 1).toLocaleDateString(locale, { month: 'long' })),
    [locale]
  );

  const perKategori = useMemo(() => {
    const grup = {};
    (data || []).forEach((p) => { (grup[p.kategori] = grup[p.kategori] || []).push(p); });
    return grup;
  }, [data]);

  return (
    <div>
      <PageHero eyebrow={t('pertanian.eyebrow')} judul={t('pertanian.judul')} teks={t('pertanian.teks')} />

      <section className="wadah py-14 lg:py-20">
        <div className="flex flex-wrap gap-2">
          {['', ...KATEGORI_PERTANIAN].map((k) => (
            <button key={k} onClick={() => { setKategori(k); setPage(1); }}
              className={`filter-pil ${kategori === k ? 'filter-aktif' : 'filter-pasif'}`}>
              {k ? t(`kategoriTani.${k}`) : t('umum.semua')}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : data?.length ? (
          Object.entries(perKategori).map(([kat, daftar]) => (
            <div key={kat} className="mt-12">
              <p className="eyebrow">{t(`kategoriTani.${kat}`)}</p>
              <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {daftar.map((p) => {
                  const aktif = bulanPanen(p.bulan_panen);
                  const nama = pick(p, 'nama');
                  const wa = linkWa(waPertanian, t('wa.pesanKebun', { nama }));
                  return (
                    <article key={p.id} className="kartu flex flex-col">
                      <div className="aspect-[16/10] overflow-hidden">
                        <ImgFallback src={p.foto} alt={nama} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-xl font-medium text-hutan-950">{nama}</h3>
                        {pick(p, 'deskripsi') && <p className="mt-2 text-sm leading-relaxed text-tinta/70">{pick(p, 'deskripsi')}</p>}

                        {/* Kalender panen 12 bulan */}
                        <div className="mt-5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-tinta/45">{t('pertanian.kalender')}</p>
                          <div className="mt-2 grid grid-cols-12 gap-1" aria-label={`${t('pertanian.kalender')}: ${pick(p, 'bulan_panen') || t('pertanian.belumDiisi')}`}>
                            {namaBulan.map((b, i) => (
                              <div key={i} title={b}
                                className={`flex h-7 items-center justify-center rounded-md text-[10px] font-bold ${
                                  aktif.includes(i) ? 'bg-emas text-hutan-950' : 'bg-hutan-100/70 text-tinta/30'
                                }`}>
                                {t('bulanSingkat')[i]}
                              </div>
                            ))}
                          </div>
                          {pick(p, 'bulan_panen') && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emas-dark">
                              <Wheat size={14} aria-hidden="true" /> {pick(p, 'bulan_panen')}
                            </p>
                          )}
                        </div>

                        <div className="mt-auto space-y-2 pt-5 text-sm">
                          {pick(p, 'frekuensi_panen') && (
                            <p className="flex items-center gap-2 text-tinta/70"><RefreshCw size={15} aria-hidden="true" /> {pick(p, 'frekuensi_panen')}</p>
                          )}
                          {p.harga_kisaran && (
                            <p className="flex items-center gap-2 font-bold text-hutan-800"><Tag size={15} aria-hidden="true" /> {p.harga_kisaran}</p>
                          )}
                          {wa && (
                            <a href={wa} target="_blank" rel="noreferrer" className="btn-wa mt-3 w-full !py-2.5 !text-xs">
                              <IkonWA size={15} /> {t('pertanian.pesanWa')}
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="mt-10"><EmptyState judul={t('pertanian.kosong')} /></div>
        )}
        <Pagination meta={meta} page={page} onPage={setPage} />

        <div className="relative isolate mt-20 overflow-hidden rounded-[2rem] bg-hutan-900 px-6 py-14 text-center sm:px-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,134,44,.22),transparent_60%)]" />
          <p className="mx-auto max-w-xl font-display text-3xl font-medium text-kabut">{t('pertanian.ajakanJudul')}</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-kabut/70">{t('pertanian.ajakanTeks')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {waPertanian && (
              <a href={linkWa(waPertanian, t('wa.tanyaKebun'))} target="_blank" rel="noreferrer" className="btn-wa">
                <IkonWA size={17} /> {t('pertanian.waPertanian')}
              </a>
            )}
            <Link to="/paket-wisata" className="btn-emas">{t('pertanian.rencanakan')}</Link>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-tinta/45">{t('pertanian.catatan')}</p>
      </section>
    </div>
  );
}
