// Tombol ganti bahasa ID / EN
import { Globe } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

export default function LangSwitch({ gelap = true, className = '' }) {
  const { lang, setLang, t } = useLang();
  const pilihan = [['id', 'ID', 'Bahasa Indonesia'], ['en', 'EN', 'English']];
  return (
    <div role="group" aria-label={t('nav.bahasa')}
      className={`flex items-center gap-0.5 rounded-full p-1 text-xs font-bold ${gelap ? 'bg-white/10 ring-1 ring-white/15' : 'bg-hutan-900/5 ring-1 ring-hutan-900/10'} ${className}`}>
      <Globe size={14} className={`mx-1.5 hidden sm:block ${gelap ? 'text-kabut/60' : 'text-hutan-800/60'}`} aria-hidden="true" />
      {pilihan.map(([kode, label, nama]) => (
        <button key={kode} type="button" onClick={() => setLang(kode)} aria-pressed={lang === kode} title={nama} lang={kode}
          className={`rounded-full px-2.5 py-1 transition ${
            lang === kode
              ? 'bg-emas text-hutan-950'
              : gelap ? 'text-kabut/70 hover:text-kabut' : 'text-hutan-900/60 hover:text-hutan-900'
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}
