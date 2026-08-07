const { body } = require('express-validator');

exports.create = [
  body('nama').trim().isLength({ min: 2, max: 100 }).withMessage('Nama wajib diisi.'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Email tidak valid.'),
  body('pesan').trim().isLength({ min: 5, max: 3000 }).withMessage('Pesan wajib diisi (5-3000 karakter).'),
];
