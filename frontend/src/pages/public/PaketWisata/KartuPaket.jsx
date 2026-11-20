import { Link } from 'react-router-dom';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import ImgFallback from '../../../components/common/ImgFallback';
import { useLang } from '../../../i18n/LanguageContext';

export default function KartuPaket({ paket, gelap = false }) {
  const { t, pick } = useLang();
  const nama = pick(paket, 'nama');
  const durasi = pick(paket, 'durasi');
  return (
    <Link to={`/paket-wisata/${paket.id}`}
      className={`group flex flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 ${
        gelap ? 'bg-white/[.04] ring-1 ring-white/10 hover:bg-white/[.07]' : 'kartu hover:shadow-angkat'
      }`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImgFallback src={paket.foto_cover} alt={nama} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="chip-gelap absolute left-4 top-4">{t(`kategoriPaket.${paket.kategori}`)}</span>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-hutan-950 opacity-0 transition duration-300 group-hover:opacity-100">
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className={`font-display text-xl font-medium leading-snug ${gelap ? 'text-kabut' : 'text-hutan-950'}`}>{nama}</h3>
        <div className={`mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-medium ${gelap ? 'text-kabut/60' : 'text-tinta/55'}`}>
          {durasi && <span className="inline-flex items-center gap-1.5"><Clock size={15} aria-hidden="true" /> {durasi}</span>}
          <span className="inline-flex items-center gap-1.5"><Users size={15} aria-hidden="true" /> {t('paket.maks', { n: paket.kapasitas })}</span>
        </div>
        <div className={`mt-auto flex items-center justify-between border-t pt-5 ${gelap ? 'mt-6 border-white/10' : 'mt-6 border-hutan-900/[.07]'}`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${gelap ? 'text-kabut/40' : 'text-tinta/40'}`}>{t('paket.harga')}</p>
            <p className={`text-sm font-bold ${gelap ? 'text-emas-light' : 'text-emas-dark'}`}>{t('paket.hargaTanya')}</p>
          </div>
          <span className={`text-sm font-bold transition ${gelap ? 'text-kabut group-hover:text-emas-light' : 'text-hutan-800 group-hover:text-emas-dark'}`}>
            {t('paket.detail')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
