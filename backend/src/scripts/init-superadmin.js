const path = require('path');
// Ini akan mencari file .env di folder 'backend' (naik 2 tingkat dari folder src/scripts)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { Admin } = require('../models');

// Data akun diambil dari .env — JANGAN menulis password langsung di kode,
// karena repo ini publik di GitHub.
const USERNAME = process.env.SEED_ADMIN_USERNAME || 'superadmin';
const NAMA = process.env.SEED_ADMIN_NAMA || 'Superadmin Kwau';
const EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@kwau.id';
const PASSWORD = process.env.SEED_ADMIN_PASSWORD;

async function createFirstSuperadmin() {
  try {
    if (!PASSWORD || PASSWORD.length < 12 || PASSWORD === 'GantiPassword123!') {
      console.error('❌ Isi SEED_ADMIN_PASSWORD di .env dengan password kuat (minimal 12 karakter, bukan contoh bawaan).');
      process.exit(1);
    }

    // Pastikan koneksi DB berhasil
    await sequelize.authenticate();

    const existingSuperadmin = await Admin.findOne({ where: { role: 'superadmin' } });
    if (existingSuperadmin) {
      console.log('Superadmin sudah ada di database. Script dibatalkan.');
      process.exit(0);
    }

    await Admin.create({
      nama: NAMA,
      username: USERNAME,
      email: EMAIL,
      password_hash: await bcrypt.hash(PASSWORD, 10),
      role: 'superadmin',
      is_active: true,
    });

    console.log('✅ Superadmin pertama berhasil dibuat!');
    console.log(`Username: ${USERNAME}`);
    console.log('Password: (sesuai SEED_ADMIN_PASSWORD di .env)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal membuat superadmin:', error);
    process.exit(1);
  }
}

createFirstSuperadmin();
