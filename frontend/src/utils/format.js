// locale: 'id-ID' (bawaan, dipakai dashboard admin) atau 'en-GB' (situs publik mode English)
export const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n) || 0);

export const formatTanggal = (t, locale = 'id-ID') =>
  t ? new Date(t).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

export const formatTanggalPendek = (t, locale = 'id-ID') =>
  t ? new Date(t).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

export const formatWaktu = (t, locale = 'id-ID') =>
  t ? new Date(t).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';

// Nomor WA dari database → format wa.me (angka saja, berkode negara)
export const nomorWaMe = (no) => {
  const angka = String(no || '').replace(/\D/g, '');
  return angka.startsWith('0') ? `62${angka.slice(1)}` : angka;
};

// Tanggal hari ini (YYYY-MM-DD) menurut WIT — untuk batas minimum input tanggal
export const hariIniWIT = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jayapura' }).format(new Date());
