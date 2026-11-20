import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

export default function Modal({ buka, onTutup, judul, children, lebar = 'max-w-lg' }) {
  const { t } = useLang();
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onTutup();
    if (buka) { document.addEventListener('keydown', esc); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [buka, onTutup]);

  if (!buka) return null;
  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-hutan-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onTutup} role="dialog" aria-modal="true" aria-label={judul}>
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-7 ${lebar}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-medium text-hutan-950">{judul}</h3>
          <button onClick={onTutup} aria-label={t('umum.tutup')} className="-mr-1.5 -mt-1 rounded-full p-2 text-tinta/50 transition hover:bg-hutan-100 hover:text-hutan-900">
            <X size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
