import { Leaf } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

export default function EmptyState({ judul, teks = '', children }) {
  const { t } = useLang();
  return (
    <div className="rounded-3xl border border-dashed border-hutan-900/20 bg-white/60 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-hutan-100 text-hutan-700">
        <Leaf size={22} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <p className="font-display text-lg font-medium text-hutan-900">{judul || t('umum.kosong')}</p>
      {teks && <p className="mx-auto mt-1.5 max-w-sm text-sm text-tinta/60">{teks}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
