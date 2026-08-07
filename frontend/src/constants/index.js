export const KATEGORI_PAKET = [
  { value: 'trekking', label: 'Trekking' },
  { value: 'birdwatching', label: 'Birdwatching' },
  { value: 'homestay', label: 'Homestay' },
  { value: 'kombinasi', label: 'Paket Kombinasi' },
];

export const KATEGORI_TITIK = [
  { value: 'pos_satwa', label: 'Pos Pengamatan Satwa', warna: '#c9862c' },
  { value: 'batas_hutan', label: 'Batas Hutan Lindung', warna: '#2f6b4c' },
  { value: 'homestay', label: 'Homestay', warna: '#7c5cbf' },
  { value: 'tokoh', label: 'Tokoh / Pemandu', warna: '#c2543a' },
  { value: 'fasilitas', label: 'Fasilitas Kampung', warna: '#2b7fb8' },
];

export const STATUS_RESERVASI = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800' },
  lunas: { label: 'Lunas', cls: 'bg-emerald-100 text-emerald-800' },
  selesai: { label: 'Selesai', cls: 'bg-sky-100 text-sky-800' },
  batal: { label: 'Batal', cls: 'bg-rose-100 text-rose-700' },
};

export const ROLE_LABEL = {
  superadmin: 'Superadmin',
  admin_reservasi: 'Admin Reservasi (Wisata)',
  admin_konten: 'Admin Konten (Wisata)',
  pegawai_kampung: 'Pegawai Kampung',
  admin_pertanian: 'Admin Pertanian',
};

export const KATEGORI_BERITA = [
  'Kegiatan Kampung', 'Musyawarah Kampung', 'Pertanian', 'Konservasi', 'Wisata', 'Pengumuman',
];

export const KATEGORI_PERTANIAN = ['Sayuran', 'Umbi-umbian', 'Buah', 'Kopi & Rempah'];

export const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
