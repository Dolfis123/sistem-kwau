const { body } = require('express-validator');
const { m } = require('../utils/bahasa');

exports.create = [
  body('nama').trim().isLength({ min: 2, max: 100 }).withMessage(m('Nama wajib diisi.', 'Please enter your name.')),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage(m('Email tidak valid.', 'Invalid email address.')),
  body('pesan').trim().isLength({ min: 5, max: 3000 })
    .withMessage(m('Pesan wajib diisi (5-3000 karakter).', 'Please write a message (5-3000 characters).')),
];
