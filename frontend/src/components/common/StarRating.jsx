export default function StarRating({ nilai = 0, onUbah = null, ukuran = 'text-lg' }) {
  return (
    <div className={`flex gap-0.5 ${ukuran}`} role={onUbah ? 'radiogroup' : undefined} aria-label={`Rating ${nilai} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onUbah}
          onClick={() => onUbah && onUbah(n)}
          className={`${n <= nilai ? 'text-emas' : 'text-hutan-900/20'} ${onUbah ? 'transition hover:scale-110' : 'cursor-default'}`}
          aria-label={onUbah ? `Beri rating ${n}` : undefined}
        >★</button>
      ))}
    </div>
  );
}
