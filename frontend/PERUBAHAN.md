# Catatan Perubahan Frontend (V6)

## Baru di V6 — Perbaikan Peraturan Kampung
- PERBAIKAN BUG: section "Peraturan Kampung" di halaman Tentang Kwau sebelumnya tidak ikut
  tersisip saat pembaruan V4 (data sudah diambil tapi tampilannya tidak dirender). Kini tampil
  sebagai daftar bernomor di antara katalog satwa dan profil pemandu.
- Jika peraturan belum diisi di database, halaman menampilkan petunjuk (jalankan seed backend),
  bukan menghilang tanpa jejak seperti sebelumnya.
- Peraturan kini mudah ditemukan dari halaman depan: tautan "Baca Peraturan Kampung →" di
  section Sekilas Kwau (Beranda), tautan cepat di footer, dan kalimat persetujuan
  "Dengan memesan, Anda menyetujui Peraturan Kampung" pada form reservasi — semuanya
  langsung menggulir ke bagian peraturan (dukungan anchor #peraturan-kampung).

Update dari V5: cukup ganti kode frontend lalu `npm install` dan `npm run dev`.
Backend TIDAK berubah (tetap V5) — tapi pastikan `npm run seed` pernah dijalankan dengan
backend V4/V5 agar konten "peraturan-kampung" ada di database.

# Catatan Perubahan Frontend (V5)

## Baru di V5 — Pagination menyeluruh
- Publik: katalog Satwa Endemik (Tentang Kwau), Hasil Pertanian, dan daftar Homestay kini
  berpaginasi (tombol Sebelumnya/Berikutnya muncul otomatis hanya jika data lebih dari satu halaman).
- Beranda: section Pesona Kwau dibatasi 12 foto teratas agar beranda tetap ringan.
- Dashboard admin: tabel Paket Wisata, Satwa, Homestay, Pesona Kwau, Berita/Informasi, dan
  Hasil Pertanian kini berpaginasi (10 baris per halaman) melalui komponen AdminCrud.
- Yang memang tanpa pagination (disengaja): FAQ (accordion per kategori), Peta (semua marker
  harus tampil), dan Peraturan/Aturan Kampung (satu teks utuh, bukan daftar database).

# Catatan Perubahan Frontend (V4)

## Baru di V4
- Harga paket & homestay TIDAK ditampilkan lagi — diganti keterangan harga fleksibel + tombol
  "Tanya Harga via WhatsApp" (paket, detail paket, dan tiap kartu homestay).
- Beranda: panel "Info Wisata Terbaru" di samping hero, otomatis berisi 3 berita kategori Wisata.
- Tentang Kwau: section "Peraturan Kampung" bernomor (diedit Pegawai Kampung di Informasi Kampung).
- Hasil Pertanian: tombol "Pesan via WhatsApp Pertanian" di tiap produk + CTA kontak Bagian
  Pertanian (nomor diatur Superadmin di Pengaturan, field "WA Bagian Pertanian").
- Ikon media sosial (Facebook, Instagram, TikTok, YouTube) di navbar & footer — tautan diatur
  Superadmin di Pengaturan; ikon hanya muncul jika tautannya diisi.
- Admin: field harga paket/homestay ditandai "internal, tidak tampil di publik".

# Catatan Perubahan Frontend (V3)

Cara memperbarui: ganti seluruh kode lama dengan isi zip ini, lalu `npm install` dan `npm run dev`.
(Perlu backend V3 — jalankan `npm run update-db` + `npm run seed` di backend terlebih dulu.)

## Yang baru
- **Logo kampung** terpasang (file `public/logo.png`) di navbar, footer, login, dan sidebar admin.
  Ganti file tersebut kapan saja untuk memperbarui logo.
- **Peta**: pilihan layer Peta Jalan / Satelit (default) / Topografi di pojok kanan atas.
- Halaman baru **Hasil Pertanian** (/pertanian) dengan kalender panen 12 bulan otomatis.
- Halaman baru **Informasi** (/informasi) — blog berita kampung berkategori + artikel unggulan.
- **Beranda**: section "Pesona Kwau" (galeri geser, dikelola admin).
- **Tentang Kwau**: marga kampung, struktur pemerintahan, dan profil pemandu/pengelola dengan
  biodata + tombol WhatsApp.
- **Paket Wisata**: section "Fasilitas dan Layanan" + fasilitas homestay tampil sebagai daftar centang.
- **Dashboard admin**: menu Informasi Kampung (pegawai kampung), Hasil Pertanian (admin pertanian);
  form pengguna dengan konfirmasi password; login dengan tombol lihat password; akun superadmin
  dan akun sendiri terkunci dari pengelolaan.
