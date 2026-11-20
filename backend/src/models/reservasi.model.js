const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Reservasi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paket_wisata_id: { type: DataTypes.INTEGER, allowNull: false },
  nama_turis: { type: DataTypes.STRING(100), allowNull: false },
  no_wa: { type: DataTypes.STRING(20), allowNull: false },
  jumlah_peserta: { type: DataTypes.INTEGER, allowNull: false },
  tanggal_kunjungan: { type: DataTypes.DATEONLY, allowNull: false },
  catatan: { type: DataTypes.TEXT },
  // Bahasa yang dipakai turis saat memesan → admin tahu harus membalas dalam bahasa apa
  bahasa: { type: DataTypes.ENUM('id', 'en'), allowNull: false, defaultValue: 'id' },
  negara: { type: DataTypes.STRING(60) },
  status: { type: DataTypes.ENUM('pending', 'lunas', 'selesai', 'batal'), allowNull: false, defaultValue: 'pending' },
}, { tableName: 'reservasi' });
