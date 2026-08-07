// V2: Galeri foto keindahan kampung (dikelola admin, tampil di Beranda)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('GaleriKampung', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  judul: { type: DataTypes.STRING(150), allowNull: false },
  url_foto: { type: DataTypes.STRING(255), allowNull: false },
  urutan: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'galeri_kampung' });
