export default function EmptyState({ judul = 'Belum ada data', teks = '', children }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-hutan-900/15 bg-white/50 px-6 py-14 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-hutan-100 text-2xl">🌿</div>
      <p className="font-display text-lg font-semibold text-hutan-900">{judul}</p>
      {teks && <p className="mx-auto mt-1 max-w-sm text-sm text-tinta/60">{teks}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
