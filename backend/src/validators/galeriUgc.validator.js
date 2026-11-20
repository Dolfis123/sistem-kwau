const { body } = require('express-validator');
const { m } = require('../utils/bahasa');

exports.create = [
  body('nama_pengunjung').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('asal').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('kontak').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('ulasan').trim().isLength({ min: 10, max: 3000 })
    .withMessage(m('Ulasan wajib diisi (10-3000 karakter).', 'Please write your story (10-3000 characters).')),
  body('rating').optional({ values: 'falsy' }).isInt({ min: 1, max: 5 })
    .withMessage(m('Rating harus 1-5.', 'Rating must be between 1 and 5.')),
  body('paket_wisata_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  body('setuju_syarat').equals('true')
    .withMessage(m('Anda harus menyetujui Syarat & Ketentuan.', 'You must accept the Terms & Conditions.')),
];

exports.moderasi = [
  body('catatan').optional({ values: 'falsy' }).isLength({ max: 255 }),
];
