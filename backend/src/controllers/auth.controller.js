const authService = require('../services/auth.service');
const { ok } = require('../utils/apiResponse');

exports.login = async (req, res, next) => {
  try {
    const hasil = await authService.login(req.body.username, req.body.password);
    return ok(res, hasil, 'Login berhasil.');
  } catch (err) { next(err); }
};

exports.profil = async (req, res) => ok(res, req.admin);

exports.gantiPassword = async (req, res, next) => {
  try {
    await authService.gantiPassword(req.admin.id, req.body.password_lama, req.body.password_baru);
    return ok(res, null, 'Password berhasil diganti.');
  } catch (err) { next(err); }
};
