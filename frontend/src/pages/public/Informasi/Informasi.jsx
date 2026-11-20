// Kabar Kampung — berita dan kegiatan dengan kategori
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import { beritaApi } from '../../../services/api';
import PageHero from '../../../components/common/PageHero';
import Loader from '../../../components/common/Loader';
import EmptyState from '../../../components/common/EmptyState';
import Pagination from '../../../components/common/Pagination';
import ImgFallback from '../../../components/common/ImgFallback';
import { formatTanggal } from '../../../utils/format';
import { KATEGORI_BERITA } from '../../../constants';
import { useLang } from '../../../i18n/LanguageContext';

export default function Informasi() {
  const { t, pick, locale } = useLang();
  const [page, setPage] = useState(1);
  const [kategori, setKategori] = useState('');
  const { data: berita, meta, loading } = useFetch(
    () => beritaApi.list({ page, limit: 9, kategori: kategori || undefined }), [page, kategori]
  );

  const unggulan = page === 1 && berita?.length ? berita[0] : null;
  const sisanya = unggulan ? berita.slice(1) : berita || [];

  return (
    <div>
      <PageHero eyebrow={t('info.eyebrow')} judul={t('info.judul')} teks={t('info.teks')} />

      <section className="wadah py-14 lg:py-20">
        <div className="flex flex-wrap gap-2">
          {['', ...KATEGORI_BERITA].map((k) => (
            <button key={k} onClick={() => { setKategori(k); setPage(1); }}
              className={`filter-pil !px-4 !py-2 !text-xs ${kategori === k ? 'filter-aktif' : 'filter-pasif'}`}>
              {k ? t(`kategoriBerita.${k}`) : t('umum.semua')}
            </button>
          ))}
        </div>

        {loading ? <Loader /> : berita?.length ? (
          <>
            {unggulan && (
              <Link to={`/informasi/${unggulan.id}`} className="kartu group mt-10 grid md:grid-cols-[1.2fr_1fr]">
                <div className="aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[360px]">
                  <ImgFallback src={unggulan.foto_sampul} alt={pick(unggulan, 'judul')} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="chip bg-emas text-hutan-950">{t(`kategoriBerita.${unggulan.kategori}`)}</span>
                    <span className="text-xs font-semibold text-tinta/45">{formatTanggal(unggulan.tanggal_terbit, locale)}</span>
                  </div>
                  <h2 className="mt-5 font-display text-3xl font-medium leading-snug text-hutan-950 lg:text-4xl">{pick(unggulan, 'judul')}</h2>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emas-dark">
                    {t('info.terbaru')} <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )}

            <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {sisanya.map((b) => (
                <Link key={b.id} to={`/informasi/${b.id}`} className="group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                    <ImgFallback src={b.foto_sampul} alt={pick(b, 'judul')} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="chip-gelap absolute left-4 top-4">{t(`kategoriBerita.${b.kategori}`)}</span>
                  </div>
                  <p className="mt-5 text-xs font-semibold text-tinta/45">{formatTanggal(b.tanggal_terbit, locale)}</p>
                  <h2 className="mt-1.5 font-display text-xl font-medium leading-snug text-hutan-950 transition group-hover:text-hutan-700">{pick(b, 'judul')}</h2>
                  <span className="mt-3 text-xs font-bold text-hutan-700 group-hover:text-emas-dark">{t('info.baca')} →</span>
                </Link>
              ))}
            </div>
            <Pagination meta={meta} page={page} onPage={setPage} />
          </>
        ) : (
          <div className="mt-10"><EmptyState judul={t('info.kosongJudul')} teks={t('info.kosongTeks')} /></div>
        )}
      </section>
    </div>
  );
}
