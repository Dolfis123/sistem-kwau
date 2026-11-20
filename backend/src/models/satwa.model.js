const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Satwa', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_lokal: { type: DataTypes.STRING(100), allowNull: false },
  nama_ilmiah: { type: DataTypes.STRING(100) },
  status_konservasi: { type: DataTypes.STRING(50) },
  deskripsi: { type: DataTypes.TEXT },
  nama_en: { type: DataTypes.STRING(100) },       // nama umum Inggris, mis. Vogelkop Bowerbird
  deskripsi_en: { type: DataTypes.TEXT },
  foto: { type: DataTypes.STRING(255) },
}, { tableName: 'satwa' });
