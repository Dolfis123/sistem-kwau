# Catatan Perubahan Backend (V5)

## Baru di V5
- Pagination opsional pada endpoint publik satwa, homestay, pertanian, dan galeri-kampung:
  jika request menyertakan ?page= maka respons dipaginasi (dengan meta total/totalPages),
  jika tidak maka mengembalikan semua data (agar peta dan statistik beranda tetap utuh).
- Update dari V4: cukup ganti kode. Tidak ada perubahan tabel dan tidak perlu seed ulang.

# Catatan Perubahan Backend (V4)

## Baru di V4
- Seed: konten statis "peraturan-kampung", pengaturan wa_pertanian + 4 tautan media sosial,
  dan 2 berita berkategori Wisata (untuk panel Info Wisata di Beranda).
- Harga paket kini opsional di validator (bersifat catatan internal, tidak tampil di publik).
- Cara update dari V3: cukup ganti kode lalu jalankan `npm run seed` (tidak ada perubahan tabel).

# Catatan Perubahan Backend (V3)

## Cara memperbarui instalasi yang SUDAH berjalan
1. Ganti seluruh kode lama dengan isi zip ini (file `.env` Anda JANGAN ditimpa).
2. `npm install`
3. `npm run update-db`   ← menambah tabel/kolom/role baru tanpa menghapus data
4. `npm run seed`        ← mengisi data contoh baru (pertanian, kategori berita, dll)
5. Restart server (`pm2 restart kwau-api` atau jalankan ulang `npm run dev`).

Instalasi baru: cukup langkah biasa (`npm install`, `npm run seed`, `npm start`).

## Yang baru
- Modul **Hasil Pertanian** (tabel `pertanian` + endpoint /api/pertanian, role admin_pertanian).
- Modul **Galeri Kampung / Pesona Kwau** (tabel `galeri_kampung` + /api/galeri-kampung).
- **Kategori berita** (kolom `kategori` di berita_konservasi) + filter ?kategori=.
- **Biodata tokoh** (kolom `bio`) + endpoint publik /api/tokoh/publik.
- Kategori titik peta baru: **fasilitas** (balai kampung, dll).
- **Role baru**: pegawai_kampung (berita & profil kampung), admin_pertanian (hasil pertanian).
- **Keamanan akun**: superadmin hanya bisa dibuat dari seed; akun superadmin dan akun sendiri
  tidak bisa diubah/di-reset/dinonaktifkan lewat endpoint /api/admin.
- Seed diperluas: SEMUA modul terisi data contoh + ±50 foto contoh dibuat otomatis di /uploads/demo.
