const multer = require('../config/multer');
const { fail } = require('../utils/apiResponse');

// Wrapper agar error Multer (file terlalu besar, tipe salah) rapi
const wrap = (handler) => (req, res, next) => {
  handler(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran file terlalu besar (maksimal 8 MB per foto).'
        : err.message;
      return fail(res, msg, 422);
    }
    next();
  });
};

exports.single = (field) => wrap(multer.single(field));
exports.array = (field, max) => wrap(multer.array(field, max));
