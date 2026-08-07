const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('PengaturanSistem', {
  key: { type: DataTypes.STRING(50), primaryKey: true },
  value: { type: DataTypes.STRING(255), allowNull: false },
}, { tableName: 'pengaturan_sistem', timestamps: false });
