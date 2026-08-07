const { validationResult } = require('express-validator');
const { fail } = require('../utils/apiResponse');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return fail(res, 'Data yang dikirim tidak valid.', 422, errors.array().map(e => ({ field: e.path, pesan: e.msg })));
  }
  next();
};
