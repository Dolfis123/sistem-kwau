const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Homestay', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_homestay: { type: DataTypes.STRING(100), allowNull: false },
  nama_pemilik: { type: DataTypes.STRING(100) },
  deskripsi: { type: DataTypes.TEXT },
  fasilitas: { type: DataTypes.TEXT },
  harga_per_malam: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  kapasitas: { type: DataTypes.INTEGER, defaultValue: 2 },
}, { tableName: 'homestay' });
