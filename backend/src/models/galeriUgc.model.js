const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('GaleriUgc', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paket_wisata_id: { type: DataTypes.INTEGER, allowNull: true },
  nama_pengunjung: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Anonim' },
  asal: { type: DataTypes.STRING(100) },
  kontak: { type: DataTypes.STRING(100) }, // hanya internal, tidak pernah dikirim ke publik
  ulasan: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.TINYINT },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  moderated_by: { type: DataTypes.INTEGER, allowNull: true },
  moderated_at: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'galeri_ugc' });
