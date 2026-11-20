import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Languages } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import { beritaApi } from '../../../services/api';
import Loader from '../../../components/common/Loader';
import ImgFallback from '../../../components/common/ImgFallback';
import { formatTanggal } from '../../../utils/format';
import { useLang } from '../../../i18n/LanguageContext';

export default function DetailInformasi() {
  const { id } = useParams();
  const { t, pick, locale, belumDiterjemahkan } = useLang();
  const { data: berita, loading } = useFetch(() => beritaApi.detail(id), [id]);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (!berita) return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 pt-24">
      <p className="text-tinta/60">{t('info.tidakAda')}</p>
      <Link to="/informasi" className="btn-hutan">{t('info.kembali')}</Link>
    </div>
  );

  return (
    <div className="pt-[72px]">
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <Link to="/informasi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-hutan-700 hover:text-emas-dark">
          <ArrowLeft size={16} aria-hidden="true" /> {t('info.semuaInfo')}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {berita.kategori && <span className="chip bg-emas text-hutan-950">{t(`kategoriBerita.${berita.kategori}`)}</span>}
          <p className="text-xs font-semibold uppercase tracking-wider text-tinta/50">
            {formatTanggal(berita.tanggal_terbit, locale)}{berita.penulis ? ` · ${berita.penulis.nama}` : ''}
          </p>
        </div>
        <h1 className="mt-5 text-4xl font-medium leading-tight text-hutan-950 sm:text-5xl">{pick(berita, 'judul')}</h1>
        {belumDiterjemahkan(berita, 'isi') && (
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emas/10 px-3 py-1 text-[11px] font-semibold text-emas-dark">
            <Languages size={13} aria-hidden="true" /> {t('umum.hanyaIndonesia')}
          </p>
        )}
        <div className="mt-9 overflow-hidden rounded-3xl">
          <ImgFallback src={berita.foto_sampul} alt={pick(berita, 'judul')} className="max-h-[460px] w-full object-cover" />
        </div>
        <div className="mt-10 whitespace-pre-line text-[17px] leading-[1.8] text-tinta/85">{pick(berita, 'isi')}</div>
        <div className="mt-16 rounded-3xl bg-hutan-900 p-8 text-center">
          <p className="font-display text-2xl font-medium text-kabut">{t('info.tertarik')}</p>
          <Link to="/paket-wisata" className="btn-emas mt-6">{t('beranda.ctaPaket')}</Link>
        </div>
      </article>
    </div>
  );
}
