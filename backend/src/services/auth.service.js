const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const generateToken = require('../utils/generateToken');

exports.login = async (username, password) => {
  const admin = await Admin.findOne({ where: { username } });
  if (!admin || !admin.is_active) {
    const err = new Error('Username atau password salah.'); err.status = 401; throw err;
  }
  const cocok = await bcrypt.compare(password, admin.password_hash);
  if (!cocok) {
    const err = new Error('Username atau password salah.'); err.status = 401; throw err;
  }
  return {
    token: generateToken(admin),
    admin: { id: admin.id, nama: admin.nama, username: admin.username, email: admin.email, role: admin.role },
  };
};

exports.gantiPassword = async (adminId, passwordLama, passwordBaru) => {
  const admin = await Admin.findByPk(adminId);
  const cocok = await bcrypt.compare(passwordLama, admin.password_hash);
  if (!cocok) { const err = new Error('Password lama salah.'); err.status = 400; throw err; }
  admin.password_hash = await bcrypt.hash(passwordBaru, 10);
  await admin.save();
};
