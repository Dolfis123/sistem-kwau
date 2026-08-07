const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('HomestayFoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  homestay_id: { type: DataTypes.INTEGER, allowNull: false },
  url_foto: { type: DataTypes.STRING(255), allowNull: false },
}, { tableName: 'homestay_foto', timestamps: false });
