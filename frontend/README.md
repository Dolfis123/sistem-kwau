# Frontend — Portal Desa Wisata Kampung Kwau

Situs publik + Dashboard Admin dalam satu proyek React (Vite + Tailwind CSS + React Router + React-Leaflet), tersambung ke backend Express yang sudah dibuat sebelumnya.

## 1. Cara Menjalankan (Development)

```bash
# 1. Pastikan BACKEND sudah berjalan dulu di http://localhost:5000

# 2. Install dependency
npm install

# 3. Jalankan
npm run dev
```

Buka `http://localhost:5173`. Tidak perlu mengatur apa pun — saat development, request `/api` dan `/uploads` otomatis diteruskan ke backend port 5000 (lihat `vite.config.js`).

Login admin: buka `http://localhost:5173/admin/login`, gunakan akun superadmin dari `.env` backend.

## 2. Identitas Visual

| Elemen | Pilihan | Alasan |
|---|---|---|
| Warna utama | Hijau hutan pekat (`#17352a` dst.) | Hutan Pegunungan Arfak |
| Aksen | Emas (`#c9862c`) | Warna bulu Cenderawasih |
| Font judul | Fraunces (serif) | Berkarakter, kesan alami & bercerita |
| Font isi | Plus Jakarta Sans | Font buatan Indonesia, sangat terbaca |
| Elemen khas | Garis kontur topografi (SVG) | Motif peta pegunungan, tampil di hero, footer, & login |

Semua token warna ada di `tailwind.config.js`; kelas siap pakai (`btn-emas`, `input`, `kartu`, `eyebrow`, dll.) ada di `src/index.css`. Responsif penuh: menu hamburger di HP, sidebar admin geser di layar kecil, tabel bisa digulir horizontal, modal menjadi bottom-sheet di HP.

## 3. Struktur Halaman

**Publik:** Beranda (`/`), Tentang Kwau (`/tentang`), Paket Wisata (`/paket-wisata`, `/paket-wisata/:id` dengan form reservasi → redirect WhatsApp), Peta Interaktif (`/peta`), Jejak Wisatawan (`/jejak-wisatawan`), FAQ (`/faq`), Kontak (`/kontak`).

**Admin (`/admin`, wajib login, menu menyesuaikan role):** Dashboard, Reservasi (filter, ubah status, export Excel), Moderasi Galeri (approve/reject/hapus + riwayat), Paket Wisata (CRUD + foto galeri + kalender kuota), Konten Publik (satwa, berita, FAQ, homestay, halaman statis), Peta & Tokoh, Pesan Kontak, Pengguna Admin (superadmin), Pengaturan.

Komponen `src/components/common/AdminCrud.jsx` adalah CRUD generik — untuk menambah modul admin baru cukup memberi konfigurasi kolom & field, tanpa menulis tabel/form dari nol.

## 4. Hal yang Perlu Anda Sesuaikan

1. **Koordinat pusat peta** — di `src/pages/public/PetaInteraktif/PetaInteraktif.jsx` ada `PUSAT_KWAU = [-1.05, 133.95]` (perkiraan). Ganti dengan koordinat asli kampung (klik kanan lokasi di Google Maps → salin angka). Peta juga otomatis berpusat ke titik pertama yang diinput admin.
2. **Peta mini** di halaman Tentang & Kontak (iframe OpenStreetMap) — sesuaikan `bbox` dan `marker` dengan koordinat asli.
3. **Foto hero Beranda** — saat ini memakai gradien + siluet burung agar tetap indah tanpa foto. Jika sudah ada foto lanskap Arfak, tambahkan sebagai background di section hero `Beranda.jsx`.

## 5. Build & Deploy (VPS, satu domain dengan backend)

```bash
npm run build     # hasil di folder dist/
```

Salin isi `dist/` ke VPS (mis. `/var/www/kwau/frontend-dist`), lalu contoh blok Nginx:

```nginx
server {
    server_name kwau.example.com;

    root /var/www/kwau/frontend-dist;
    index index.html;

    # SPA: semua rute diarahkan ke index.html
    location / { try_files $uri $uri/ /index.html; }

    # Teruskan API & file upload ke backend (PM2, port 5000)
    location /api/     { proxy_pass http://localhost:5000; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }
    location /uploads/ { proxy_pass http://localhost:5000; }
}
```

Karena satu domain, `VITE_API_BASE_URL` di `.env` **dibiarkan kosong**. Jika suatu saat frontend & backend beda domain, isi `.env` dengan `VITE_API_BASE_URL=https://api.domainanda.com` lalu build ulang.
