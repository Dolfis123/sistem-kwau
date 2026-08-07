const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('GaleriUgcFoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  galeri_ugc_id: { type: DataTypes.INTEGER, allowNull: false },
  url_foto: { type: DataTypes.STRING(255), allowNull: false },
}, { tableName: 'galeri_ugc_foto', timestamps: false });
