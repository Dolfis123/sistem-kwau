const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('KontakPesan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  pesan: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('baru', 'dibaca'), defaultValue: 'baru' },
}, { tableName: 'kontak_pesan', updatedAt: false });
