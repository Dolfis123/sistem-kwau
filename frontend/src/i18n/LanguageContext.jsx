// Sistem dua bahasa (Indonesia / English) untuk situs publik.
// - Pilihan bahasa disimpan di localStorage ("kwau_lang").
// - Kunjungan pertama: browser berbahasa Indonesia → ID, selain itu → EN
//   (mayoritas pengunjung Kwau adalah turis mancanegara).
// - Tautan bisa memaksa bahasa: https://.../paket-wisata?lang=en
// - Dashboard admin SELALU berbahasa Indonesia.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import kamus from './kamus';

const KUNCI = 'kwau_lang';
const LanguageContext = createContext(null);

const bacaSimpanan = () => {
  try { return localStorage.getItem(KUNCI); } catch { return null; }
};

const deteksiAwal = () => {
  try {
    const dariUrl = new URLSearchParams(window.location.search).get('lang');
    if (dariUrl === 'id' || dariUrl === 'en') return dariUrl;
  } catch { /* abaikan */ }
  const simpan = bacaSimpanan();
  if (simpan === 'id' || simpan === 'en') return simpan;
  const daftar = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return daftar.some((l) => String(l).toLowerCase().startsWith('id')) ? 'id' : 'en';
};

// Ambil teks dari kamus dengan kunci bertitik, mis. t('beranda.hero.judul', { n: 3 })
const ambil = (bahasa, kunci) => kunci.split('.').reduce((o, k) => (o == null ? o : o[k]), kamus[bahasa]);

export function LanguageProvider({ children }) {
  const { pathname } = useLocation();
  const [pilihan, setPilihan] = useState(() => {
    const awal = deteksiAwal();
    // Simpan segera: permintaan API pertama (header X-Lang) sudah memakai bahasa ini
    try { localStorage.setItem(KUNCI, awal); } catch { /* mode privat */ }
    return awal;
  });
  const diAdmin = pathname.startsWith('/admin');
  const lang = diAdmin ? 'id' : pilihan;

  useEffect(() => {
    try { localStorage.setItem(KUNCI, pilihan); } catch { /* mode privat */ }
  }, [pilihan]);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  const t = useCallback((kunci, vars) => {
    let teks = ambil(lang, kunci);
    if (teks == null) teks = ambil('id', kunci); // cadangan
    // Kunci tak dikenal (mis. kategori baru buatan admin) → tampilkan nilainya apa adanya
    if (teks == null) return kunci.slice(kunci.indexOf('.') + 1);
    if (vars && typeof teks === 'string') {
      teks = teks.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
    }
    return teks;
  }, [lang]);

  // Ambil kolom versi Inggris dari data API jika tersedia, mis. pick(paket, 'nama') → paket.nama_en
  const pick = useCallback((obj, field) => {
    if (!obj) return '';
    if (lang === 'en') {
      const en = obj[`${field}_en`];
      if (typeof en === 'string' && en.trim()) return en;
    }
    return obj[field] ?? '';
  }, [lang]);

  // true bila konten hanya tersedia dalam Bahasa Indonesia saat mode EN
  const belumDiterjemahkan = useCallback((obj, field) => (
    lang === 'en' && !!obj?.[field] && !(obj?.[`${field}_en`] || '').trim()
  ), [lang]);

  const locale = lang === 'en' ? 'en-GB' : 'id-ID';

  const nilai = useMemo(() => ({
    lang, setLang: setPilihan, t, pick, belumDiterjemahkan, locale,
  }), [lang, t, pick, belumDiterjemahkan, locale]);

  return <LanguageContext.Provider value={nilai}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);

// Untuk kode di luar komponen React (mis. axios): bahasa situs publik saat ini
export const bahasaSaatIni = () => {
  if (window.location.pathname.startsWith('/admin')) return 'id';
  const s = bacaSimpanan();
  return s === 'en' ? 'en' : 'id';
};
