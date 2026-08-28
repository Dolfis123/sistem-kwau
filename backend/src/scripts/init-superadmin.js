const path = require('path');
// Ini akan mencari file .env di folder 'backend' (naik 2 tingkat dari folder src/scripts)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { Admin } = require('../models');

async function createFirstSuperadmin() {
  try {
    // Pastikan koneksi DB berhasil
    await sequelize.authenticate();

    const existingSuperadmin = await Admin.findOne({ where: { role: 'superadmin' } });
    if (existingSuperadmin) {
      console.log('Superadmin sudah ada di database. Script dibatalkan.');
      process.exit(0);
    }

    const passwordLengkap = 'SuperRahasia123!';
    const password_hash = await bcrypt.hash(passwordLengkap, 10);

    await Admin.create({
      nama: 'Super Admin Utama',
      username: 'admin',
      email: 'admin@admin.com',
      password_hash: password_hash,
      role: 'superadmin',
      is_active: true
    });

    console.log('✅ Superadmin pertama berhasil dibuat!');
    console.log(`Username: superadmin`);
    console.log(`Password: ${passwordLengkap}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal membuat superadmin:', error);
    process.exit(1);
  }
}

createFirstSuperadmin();