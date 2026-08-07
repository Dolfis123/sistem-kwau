const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('TokohPemandu', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  peta_titik_id: { type: DataTypes.INTEGER, allowNull: true },
  nama: { type: DataTypes.STRING(100), allowNull: false },
  jabatan: { type: DataTypes.STRING(100) },
  spesialisasi: { type: DataTypes.STRING(100) },
  bio: { type: DataTypes.TEXT }, // V2: biodata singkat untuk profil publik
  no_wa: { type: DataTypes.STRING(20) },
  foto: { type: DataTypes.STRING(255) },
  status_aktif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'tokoh_pemandu' });
