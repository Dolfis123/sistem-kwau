const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('PaketWisata', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  admin_id: { type: DataTypes.INTEGER, allowNull: true },
  nama: { type: DataTypes.STRING(150), allowNull: false },
  kategori: { type: DataTypes.ENUM('trekking', 'birdwatching', 'homestay', 'kombinasi'), allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  itinerary: { type: DataTypes.TEXT },
  harga: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  durasi: { type: DataTypes.STRING(50) },
  kapasitas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  foto_cover: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.ENUM('aktif', 'nonaktif'), allowNull: false, defaultValue: 'aktif' },
}, { tableName: 'paket_wisata' });
