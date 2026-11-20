import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

export default function Pagination({ meta, page, onPage }) {
  const { t } = useLang();
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
      <button className="btn-garis !px-4 !py-2 !text-xs" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <ArrowLeft size={14} aria-hidden="true" /> {t('umum.sebelumnya')}
      </button>
      <span className="px-2 text-sm font-semibold text-hutan-900">
        {t('umum.halaman', { a: meta.page, b: meta.totalPages })}
      </span>
      <button className="btn-garis !px-4 !py-2 !text-xs" disabled={page >= meta.totalPages} onClick={() => onPage(page + 1)}>
        {t('umum.berikutnya')} <ArrowRight size={14} aria-hidden="true" />
      </button>
    </nav>
  );
}
