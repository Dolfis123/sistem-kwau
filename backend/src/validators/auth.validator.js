const { body } = require('express-validator');

exports.login = [
  body('username').trim().notEmpty().withMessage('Username wajib diisi.'),
  body('password').notEmpty().withMessage('Password wajib diisi.'),
];

exports.gantiPassword = [
  body('password_lama').notEmpty().withMessage('Password lama wajib diisi.'),
  body('password_baru').isLength({ min: 8 }).withMessage('Password baru minimal 8 karakter.'),
];
