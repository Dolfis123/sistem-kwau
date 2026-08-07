const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('PaketFoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paket_wisata_id: { type: DataTypes.INTEGER, allowNull: false },
  url_foto: { type: DataTypes.STRING(255), allowNull: false },
  urutan: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'paket_foto', timestamps: false });
