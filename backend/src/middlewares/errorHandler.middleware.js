const logger = require('../utils/logger');
const { fail } = require('../utils/apiResponse');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(`${req.method} ${req.originalUrl} -> ${err.message}`);
  if (err.name === 'SequelizeUniqueConstraintError') {
    return fail(res, 'Data sudah ada (duplikat).', 409);
  }
  const status = err.status || 500;
  return fail(res, status === 500 ? 'Terjadi kesalahan pada server.' : err.message, status);
};
