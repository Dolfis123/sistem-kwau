const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('PaketKetersediaan', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paket_wisata_id: { type: DataTypes.INTEGER, allowNull: false },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
  kuota_tersedia: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('tersedia', 'penuh', 'ditutup'), allowNull: false, defaultValue: 'tersedia' },
}, {
  tableName: 'paket_ketersediaan',
  timestamps: false,
  indexes: [{ unique: true, fields: ['paket_wisata_id', 'tanggal'] }],
});
