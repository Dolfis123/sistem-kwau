import { useState } from 'react';
import { imgUrl } from '../../utils/img';

// Gambar dengan fallback bermotif daun jika foto belum diupload / gagal dimuat
export default function ImgFallback({ src, alt = '', className = '' }) {
  const [gagal, setGagal] = useState(false);
  const url = imgUrl(src);
  if (!url || gagal) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-hutan-800 to-hutan-950 text-emas/70 ${className}`} role="img" aria-label={alt}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M4 19c4-9 9-13 16-14-1 7-5 12-14 13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 19c3-3 6-5 10-6" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  return <img src={url} alt={alt} loading="lazy" className={className} onError={() => setGagal(true)} />;
}
