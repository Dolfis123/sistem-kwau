const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (admin) =>
  jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
