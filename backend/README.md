# Backend — Portal Desa Wisata Kampung Kwau

REST API untuk Sistem Informasi & Reservasi Wisata Kampung Kwau
(Node.js + Express + Sequelize + MySQL — **tanpa migrations**, tabel dibuat otomatis via `sequelize.sync()`).

## 1. Cara Menjalankan (Development)

```bash
# 1. Salin konfigurasi lalu edit sesuai MySQL Anda
cp .env.example .env

# 2. Buat database kosong di MySQL
#    CREATE DATABASE kwau_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Install dependency
npm install

# 4. Isi data awal (superadmin, pengaturan, konten statis, FAQ contoh)
npm run seed

# 5. Jalankan server
npm run dev        # dengan nodemon (auto reload)
# atau
npm start
```

Server berjalan di `http://localhost:5000`. Semua tabel dibuat **otomatis** saat server pertama kali dijalankan — tidak perlu perintah migrasi apa pun.

Login admin pertama memakai `SEED_ADMIN_USERNAME` dan `SEED_ADMIN_PASSWORD` dari `.env` (segera ganti password setelah login pertama lewat endpoint ganti-password).

## 2. Kenapa Tanpa Migrations?

Skema tabel didefinisikan langsung di `src/models/`. Saat server start, `sequelize.sync()` membuat tabel yang belum ada. Ini lebih sederhana untuk tim kecil.

**Aturan penting:**
- Jangan pernah pakai `sync({ force: true })` di produksi — menghapus semua data.
- Jika nanti perlu **menambah kolom** setelah sistem berisi data: tambahkan kolom manual via SQL/phpMyAdmin (`ALTER TABLE ... ADD COLUMN ...`), lalu tambahkan kolom yang sama di file model. Selesai.
- Selalu jalankan backup (`npm run backup`) sebelum mengubah struktur tabel.

## 3. Lima Perbaikan dari Blueprint (lokasinya di kode)

| # | Perbaikan | Lokasi |
|---|-----------|--------|
| 1 | Logika kuota reservasi (kurangi saat pending, kembalikan saat batal, transaksi + row-lock, auto-batal pending >48 jam) | `src/services/reservasi.service.js`, `src/cron/jobs.js` |
| 2 | Anti-spam form publik: rate limiting + honeypot | `src/middlewares/rateLimit.middleware.js`, `src/middlewares/honeypot.middleware.js` |
| 3 | Kompresi gambar otomatis (sharp → WebP, maks 1600px, ~75% quality) | `src/utils/imageProcessor.js` |
| 4 | Backup database otomatis (mysqldump, simpan 14 terakhir) | `scripts/backup.js` |
| 5 | Pagination endpoint publik, batas ukuran/tipe file upload, validasi nomor WA Indonesia | `src/utils/pagination.js`, `src/config/multer.js`, `src/validators/reservasi.validator.js` |

**Catatan honeypot (untuk tim frontend):** tambahkan input tersembunyi di setiap form publik:
```html
<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off" />
```
Manusia tidak melihatnya; jika bot mengisinya, backend diam-diam membuang kiriman itu.

## 4. Backup Otomatis Harian di VPS

```bash
crontab -e
# tambahkan baris ini (backup tiap hari jam 02.00):
0 2 * * * cd /var/www/kwau/backend && /usr/bin/node scripts/backup.js >> logs/backup.log 2>&1
```
Sesekali unduh file `backups/*.sql` ke laptop/Google Drive agar ada salinan di luar server.

## 5. Ringkasan Endpoint Utama

### Publik (tanpa login)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/paket-wisata?kategori=&q=&page=` | Daftar paket aktif (pagination) |
| GET | `/api/paket-wisata/:id` | Detail paket + foto + kalender ketersediaan |
| POST | `/api/reservasi` | Kirim reservasi → respons berisi `wa_link` untuk redirect WhatsApp |
| GET | `/api/galeri?page=` | Galeri UGC approved |
| POST | `/api/galeri` (multipart, `foto` maks 2) | Kirim pengalaman, status pending |
| GET | `/api/peta?kategori=` | Titik peta aktif + tokoh/pemandu |
| GET | `/api/homestay` | Daftar homestay + foto |
| GET | `/api/satwa` | Katalog satwa endemik |
| GET | `/api/berita`, `/api/berita/:id` | Berita konservasi |
| GET | `/api/faq?kategori=` | FAQ |
| GET | `/api/konten/:slug` | Konten statis (sekilas-kwau, aturan-berkunjung, sejarah-kampung) |
| GET | `/api/konten/pengaturan` | Pengaturan publik (WA utama, jam operasional) |
| POST | `/api/kontak` | Form kontak |

### Admin (header `Authorization: Bearer <token>`)
| Method | Endpoint | Role |
|---|---|---|
| POST | `/api/auth/login` | semua |
| GET | `/api/dashboard/ringkasan` | semua admin |
| GET/PUT | `/api/reservasi`, `/api/reservasi/:id/status`, `/api/reservasi/kalender?bulan=YYYY-MM`, `/api/reservasi/export/excel` | admin_reservasi |
| CRUD | `/api/paket-wisata`, `/api/homestay`, `/api/satwa`, `/api/berita`, `/api/faq`, `/api/konten`, `/api/peta`, `/api/tokoh` | admin_konten |
| GET/PUT/DELETE | `/api/galeri/admin/antrean`, `.../:id/approve`, `.../:id/reject`, `.../:id` | admin_konten |
| CRUD | `/api/admin` (manajemen akun admin) | superadmin |
| PUT | `/api/konten/pengaturan` | superadmin |

Superadmin otomatis punya akses ke semua endpoint.

## 6. Deploy Singkat (VPS Ubuntu + Nginx + PM2)

```bash
npm install --production
npm run seed
pm2 start server.js --name kwau-api
pm2 save && pm2 startup
```
Nginx meneruskan `/api/*` dan `/uploads/*` ke port 5000 sesuai arsitektur di blueprint.
