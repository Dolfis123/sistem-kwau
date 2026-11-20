import { Link } from 'react-router-dom';
import GarisKontur from '../../components/common/GarisKontur';
import { useLang } from '../../i18n/LanguageContext';

export default function TidakDitemukan() {
  const { t } = useLang();
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-hutan-950 px-4 text-center text-kabut">
      <GarisKontur className="absolute inset-x-0 bottom-0 h-64 w-full text-emas/40" />
      <p className="font-display text-8xl font-medium text-emas-light">404</p>
      <p className="text-kabut/70">{t('umum.halamanTidakAda')}</p>
      <Link to="/" className="btn-emas relative">{t('umum.keBeranda')}</Link>
    </div>
  );
}
