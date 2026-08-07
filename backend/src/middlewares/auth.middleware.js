const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { Admin } = require('../models');
const { fail } = require('../utils/apiResponse');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return fail(res, 'Token tidak ditemukan. Silakan login.', 401);

    const payload = jwt.verify(header.slice(7), env.JWT_SECRET);
    const admin = await Admin.findByPk(payload.id);
    if (!admin || !admin.is_active) return fail(res, 'Akun tidak aktif atau tidak ditemukan.', 401);

    req.admin = { id: admin.id, nama: admin.nama, role: admin.role };
    next();
  } catch (err) {
    return fail(res, 'Token tidak valid atau kedaluwarsa. Silakan login ulang.', 401);
  }
};
