import { useEffect } from 'react';

export default function Modal({ buka, onTutup, judul, children, lebar = 'max-w-lg' }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onTutup();
    if (buka) { document.addEventListener('keydown', esc); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [buka, onTutup]);

  if (!buka) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-hutan-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onTutup} role="dialog" aria-modal="true">
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl ${lebar}`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-hutan-950">{judul}</h3>
          <button onClick={onTutup} aria-label="Tutup" className="rounded-full p-1.5 text-tinta/50 transition hover:bg-hutan-100 hover:text-hutan-900">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
