const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('PetaTitik', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  kategori: { type: DataTypes.ENUM('pos_satwa', 'batas_hutan', 'homestay', 'tokoh', 'fasilitas'), allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  nama_en: { type: DataTypes.STRING(100) },
  deskripsi_en: { type: DataTypes.TEXT },
  foto: { type: DataTypes.STRING(255) },
  status_aktif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'peta_titik' });
