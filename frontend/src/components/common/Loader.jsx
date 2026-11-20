import { useLang } from '../../i18n/LanguageContext';

export default function Loader({ teks }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-hutan-700" role="status">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-hutan-200 border-t-emas" />
      <span className="text-sm font-medium">{teks || t('umum.memuat')}</span>
    </div>
  );
}
