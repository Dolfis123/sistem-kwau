const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('BeritaKonservasi', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  admin_id: { type: DataTypes.INTEGER, allowNull: true },
  judul: { type: DataTypes.STRING(150), allowNull: false },
  kategori: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Kegiatan Kampung' }, // V3: kategori blog
  isi: { type: DataTypes.TEXT, allowNull: false },
  judul_en: { type: DataTypes.STRING(150) },
  isi_en: { type: DataTypes.TEXT },
  foto_sampul: { type: DataTypes.STRING(255) },
  tanggal_terbit: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
}, { tableName: 'berita_konservasi' });
