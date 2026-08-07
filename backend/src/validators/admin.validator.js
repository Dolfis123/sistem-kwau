const { body } = require('express-validator');

exports.create = [
  body('nama').trim().isLength({ min: 2, max: 100 }).withMessage('Nama wajib diisi.'),
  body('username').trim().isLength({ min: 4, max: 50 }).withMessage('Username minimal 4 karakter.'),
  body('email').isEmail().withMessage('Email tidak valid.'),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter.'),
  body('role').isIn(['admin_reservasi', 'admin_konten', 'pegawai_kampung', 'admin_pertanian'])
    .withMessage('Role tidak valid. Akun superadmin hanya dapat dibuat dari server (seed).'),
];
