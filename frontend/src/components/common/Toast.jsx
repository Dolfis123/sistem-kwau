import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [daftar, setDaftar] = useState([]);

  const tampilkan = useCallback((pesan, tipe = 'sukses') => {
    const id = Date.now() + Math.random();
    setDaftar((d) => [...d, { id, pesan, tipe }]);
    setTimeout(() => setDaftar((d) => d.filter((t) => t.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={tampilkan}>
      {children}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[1400] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
        {daftar.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              t.tipe === 'error' ? 'bg-rose-600' : 'bg-hutan-800'
            }`}
          >
            {t.pesan}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
