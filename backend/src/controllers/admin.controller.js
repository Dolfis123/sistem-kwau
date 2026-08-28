// Manajemen pengguna admin — khusus Superadmin.
// V3 KEAMANAN:
// - Superadmin TIDAK bisa dibuat/diubah/di-reset dari dashboard (hanya dari seed di server).
// - Superadmin tidak bisa mengubah/menonaktifkan akunnya sendiri lewat menu ini
//   (kelola akun sendiri hanya lewat menu Pengaturan → ganti password).
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');
const { ok, fail } = require('../utils/apiResponse');


const adminService = require('../services/auth.service');

exports.create = async (req, res, next) => {
  try {
    const hasil = await adminService.createAdmin(req.body);
    
    // Jangan kembalikan password_hash ke response API demi keamanan
    const { password_hash, ...adminData } = hasil.toJSON();
    
    return ok(res, adminData, 'Akun admin berhasil dibuat.');
  } catch (err) { 
    next(err); 
  }
};

// Jangan lupa untuk menambahkan method lain seperti list, update, resetPassword yang ada di routes Anda.
exports.list = async (req, res, next) => {
  try {
    return ok(res, await Admin.findAll({ attributes: { exclude: ['password_hash'] }, order: [['created_at', 'ASC']] }));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { nama, username, email, password, role } = req.body;
    if (role === 'superadmin') {
      return fail(res, 'Akun superadmin tidak dapat dibuat dari dashboard. Buat melalui seed di server.', 403);
    }
    const admin = await Admin.create({ nama, username, email, role, password_hash: await bcrypt.hash(password, 10) });
    const { password_hash, ...aman } = admin.toJSON();
    return ok(res, aman, 'Admin baru berhasil dibuat.', 201);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.admin.id) {
      return fail(res, 'Anda tidak dapat mengubah akun Anda sendiri di menu ini. Gunakan menu Pengaturan.', 403);
    }
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return fail(res, 'Admin tidak ditemukan.', 404);
    if (admin.role === 'superadmin') {
      return fail(res, 'Akun superadmin tidak dapat diubah dari dashboard.', 403);
    }
    if (req.body.role === 'superadmin') {
      return fail(res, 'Role tidak dapat dinaikkan menjadi superadmin dari dashboard.', 403);
    }
    const { nama, email, role, is_active } = req.body;
    await admin.update({ nama, email, role, is_active });
    const { password_hash, ...aman } = admin.toJSON();
    return ok(res, aman, 'Data admin berhasil diperbarui.');
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    if (Number(req.params.id) === req.admin.id) {
      return fail(res, 'Gunakan menu Pengaturan untuk mengganti password Anda sendiri.', 403);
    }
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) return fail(res, 'Admin tidak ditemukan.', 404);
    if (admin.role === 'superadmin') {
      return fail(res, 'Password superadmin tidak dapat di-reset dari dashboard.', 403);
    }
    const { password_baru } = req.body;
    if (!password_baru || password_baru.length < 8) return fail(res, 'Password baru minimal 8 karakter.', 422);
    await admin.update({ password_hash: await bcrypt.hash(password_baru, 10) });
    return ok(res, null, 'Password admin berhasil di-reset.');
  } catch (err) { next(err); }
};