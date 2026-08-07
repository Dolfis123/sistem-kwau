// V3: Hasil pertanian kampung — potensi yang bisa dibeli wisatawan
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Pertanian', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  kategori: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Sayuran' }, // Sayuran, Umbi-umbian, Buah, Kopi & Rempah
  deskripsi: { type: DataTypes.TEXT },
  bulan_panen: { type: DataTypes.STRING(150) },      // mis. "Juni – Agustus (panen raya)"
  frekuensi_panen: { type: DataTypes.STRING(100) },  // mis. "2x panen per tahun"
  harga_kisaran: { type: DataTypes.STRING(100) },    // mis. "Rp15.000–20.000 / kg"
  foto: { type: DataTypes.STRING(255) },
}, { tableName: 'pertanian' });
