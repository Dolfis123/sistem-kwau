// Format response konsisten di seluruh API
exports.ok = (res, data = null, message = 'Berhasil', status = 200, meta = undefined) => {
  return res.status(status).json({ success: true, message, data, ...(meta ? { meta } : {}) });
};

exports.fail = (res, message = 'Terjadi kesalahan', status = 400, errors = undefined) => {
  return res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
};
