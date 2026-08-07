const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('KontenStatis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  judul: { type: DataTypes.STRING(150), allowNull: false },
  isi: { type: DataTypes.TEXT, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'konten_statis' });
