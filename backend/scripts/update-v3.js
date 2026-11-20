// Skrip pembaruan V3 (dwibahasa) untuk database yang SUDAH ADA.
// Jalankan SEKALI di server setelah menarik kode baru:   npm run update-db-v3
// Aman dijalankan berulang: kolom yang sudah ada akan dilewati.
// Instalasi baru tidak perlu skrip ini — sync() sudah membuat semua kolom.
//
// SEBELUM menjalankan: buat backup dulu →  npm run backup
require('dotenv').config();
const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/models');

const STR = (n) => ({ type: DataTypes.STRING(n), allowNull: true });
const TEXT = { type: DataTypes.TEXT, allowNull: true };

// tabel → { kolom: definisi }
const KOLOM_BARU = {
  paket_wisata: { nama_en: STR(150), deskripsi_en: TEXT, itinerary_en: TEXT, durasi_en: STR(50) },
  faq: { pertanyaan_en: TEXT, jawaban_en: TEXT },
  konten_statis: { judul_en: STR(150), isi_en: TEXT },
  satwa: { nama_en: STR(100), deskripsi_en: TEXT },
  homestay: { deskripsi_en: TEXT, fasilitas_en: TEXT },
  berita_konservasi: { judul_en: STR(150), isi_en: TEXT },
  peta_titik: { nama_en: STR(100), deskripsi_en: TEXT },
  tokoh_pemandu: { jabatan_en: STR(100), spesialisasi_en: STR(100), bio_en: TEXT, bahasa: STR(100) },
  galeri_kampung: { judul_en: STR(150) },
  pertanian: { nama_en: STR(100), deskripsi_en: TEXT, bulan_panen_en: STR(150), frekuensi_panen_en: STR(100) },
  reservasi: {
    bahasa: { type: DataTypes.ENUM('id', 'en'), allowNull: false, defaultValue: 'id' },
    negara: STR(60),
  },
};

(async () => {
  const qi = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();
    let ditambah = 0;
    for (const [tabel, kolom] of Object.entries(KOLOM_BARU)) {
      const ada = await qi.describeTable(tabel);
      for (const [nama, def] of Object.entries(kolom)) {
        if (ada[nama]) { console.log(`[V3] ${tabel}.${nama} sudah ada, dilewati.`); continue; }
        await qi.addColumn(tabel, nama, def);
        ditambah++;
        console.log(`[V3] + ${tabel}.${nama}`);
      }
    }
    console.log(`[V3] Selesai. ${ditambah} kolom baru ditambahkan.`);
    console.log('[V3] Isi versi Bahasa Inggris lewat Dashboard Admin (kolom bertanda "English").');
    process.exit(0);
  } catch (err) {
    console.error('[V3] Gagal:', err.message);
    process.exit(1);
  }
})();
