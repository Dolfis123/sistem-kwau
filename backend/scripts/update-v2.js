// Skrip pembaruan untuk database yang SUDAH ADA (jalankan sekali: npm run update-db).
// Instalasi baru tidak perlu skrip ini — cukup sync() + seed.
require('dotenv').config();
const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/models');

(async () => {
  const qi = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();

    // 1. Tabel baru (galeri_kampung, pertanian) dibuat otomatis
    await sequelize.sync();
    console.log('[UPDATE] Tabel baru disinkronkan (galeri_kampung, pertanian).');

    // 2. Kategori "fasilitas" pada peta_titik
    try {
      await sequelize.query("ALTER TABLE peta_titik MODIFY COLUMN kategori ENUM('pos_satwa','batas_hutan','homestay','tokoh','fasilitas') NOT NULL");
      console.log('[UPDATE] Kategori "fasilitas" ditambahkan ke peta_titik.');
    } catch (e) { console.log('[UPDATE] Enum peta_titik: ' + e.message); }

    // 3. Role baru pada admins (pegawai_kampung, admin_pertanian)
    try {
      await sequelize.query("ALTER TABLE admins MODIFY COLUMN role ENUM('superadmin','admin_reservasi','admin_konten','pegawai_kampung','admin_pertanian') NOT NULL DEFAULT 'admin_konten'");
      console.log('[UPDATE] Role baru ditambahkan ke admins.');
    } catch (e) { console.log('[UPDATE] Enum admins: ' + e.message); }

    // 4. Kolom bio pada tokoh_pemandu
    try {
      await qi.addColumn('tokoh_pemandu', 'bio', { type: DataTypes.TEXT, allowNull: true });
      console.log('[UPDATE] Kolom "bio" ditambahkan ke tokoh_pemandu.');
    } catch (e) { console.log('[UPDATE] Kolom bio sudah ada, dilewati.'); }

    // 5. Kolom kategori pada berita_konservasi
    try {
      await qi.addColumn('berita_konservasi', 'kategori', { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Kegiatan Kampung' });
      console.log('[UPDATE] Kolom "kategori" ditambahkan ke berita_konservasi.');
    } catch (e) { console.log('[UPDATE] Kolom kategori sudah ada, dilewati.'); }

    console.log('[UPDATE] Selesai. Jalankan "npm run seed" untuk mengisi data contoh baru.');
    process.exit(0);
  } catch (err) {
    console.error('[UPDATE] Gagal:', err.message);
    process.exit(1);
  }
})();
