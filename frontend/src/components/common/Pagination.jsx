export default function Pagination({ meta, page, onPage }) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className="btn-garis !px-4 !py-2 !text-xs" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        ← Sebelumnya
      </button>
      <span className="px-3 text-sm font-semibold text-hutan-900">
        Hal. {meta.page} / {meta.totalPages}
      </span>
      <button className="btn-garis !px-4 !py-2 !text-xs" disabled={page >= meta.totalPages} onClick={() => onPage(page + 1)}>
        Berikutnya →
      </button>
    </div>
  );
}
