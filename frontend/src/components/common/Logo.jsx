import { useState } from 'react';

// Logo resmi kampung: letakkan file bernama "logo.png" di folder frontend/public/.
// Jika file belum ada, otomatis kembali ke lambang "K" agar tampilan tetap rapi.
export default function Logo({ ukuran = 'h-9 w-9', teksUkuran = 'text-lg' }) {
  const [pakaiFallback, setPakaiFallback] = useState(false);
  if (pakaiFallback) {
    return (
      <span className={`flex ${ukuran} items-center justify-center rounded-full bg-emas font-display ${teksUkuran} font-bold text-hutan-950`}>
        K
      </span>
    );
  }
  return (
    <img
      src="/logo.png"
      alt="Logo Kampung Kwau"
      className={`${ukuran} rounded-full object-cover ring-2 ring-emas/60`}
      onError={() => setPakaiFallback(true)}
    />
  );
}
