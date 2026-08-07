const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('ModerasiLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  galeri_ugc_id: { type: DataTypes.INTEGER, allowNull: false },
  admin_id: { type: DataTypes.INTEGER, allowNull: false },
  aksi: { type: DataTypes.ENUM('approve', 'reject', 'delete'), allowNull: false },
  catatan: { type: DataTypes.STRING(255) },
}, { tableName: 'moderasi_log', updatedAt: false });
