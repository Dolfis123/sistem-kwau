// Pengaturan publik (nomor WA, jam layanan, sosmed) — diambil SEKALI lalu dipakai bersama
// oleh navbar, footer, tombol WhatsApp, dan halaman-halaman publik.
import { useEffect, useState } from 'react';
import { kontenApi } from '../services/api';

let cache = null;
let janji = null;

const muat = () => {
  if (!janji) {
    janji = kontenApi.getPengaturan()
      .then((res) => { cache = res.data.data || {}; return cache; })
      .catch(() => { janji = null; return {}; });
  }
  return janji;
};

export default function usePengaturan() {
  const [data, setData] = useState(cache);
  useEffect(() => {
    let aktif = true;
    if (!cache) muat().then((d) => { if (aktif) setData(d); });
    return () => { aktif = false; };
  }, []);
  return data || {};
}

// Link wa.me dengan pesan siap kirim
export const linkWa = (nomor, pesan) => {
  const angka = String(nomor || '').replace(/\D/g, '');
  if (!angka) return null;
  return `https://wa.me/${angka}${pesan ? `?text=${encodeURIComponent(pesan)}` : ''}`;
};
