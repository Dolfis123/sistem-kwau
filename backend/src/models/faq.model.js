const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Faq', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  kategori: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'Umum' },
  pertanyaan: { type: DataTypes.TEXT, allowNull: false },
  jawaban: { type: DataTypes.TEXT, allowNull: false },
  pertanyaan_en: { type: DataTypes.TEXT },
  jawaban_en: { type: DataTypes.TEXT },
  urutan: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'faq', timestamps: false });
