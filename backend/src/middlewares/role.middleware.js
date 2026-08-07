const { fail } = require('../utils/apiResponse');

// Superadmin selalu boleh; role lain harus ada di daftar izin
module.exports = (...roles) => (req, res, next) => {
  if (!req.admin) return fail(res, 'Belum login.', 401);
  if (req.admin.role === 'superadmin' || roles.includes(req.admin.role)) return next();
  return fail(res, 'Anda tidak memiliki hak akses untuk fitur ini.', 403);
};
