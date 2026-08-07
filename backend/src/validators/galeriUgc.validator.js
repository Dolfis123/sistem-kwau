const { body } = require('express-validator');

exports.create = [
  body('nama_pengunjung').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('asal').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('kontak').optional({ values: 'falsy' }).trim().isLength({ max: 100 }),
  body('ulasan').trim().isLength({ min: 10, max: 3000 }).withMessage('Ulasan wajib diisi (10-3000 karakter).'),
  body('rating').optional({ values: 'falsy' }).isInt({ min: 1, max: 5 }).withMessage('Rating harus 1-5.'),
  body('paket_wisata_id').optional({ values: 'falsy' }).isInt({ min: 1 }),
  body('setuju_syarat').equals('true').withMessage('Anda harus menyetujui Syarat & Ketentuan.'),
];

exports.moderasi = [
  body('catatan').optional({ values: 'falsy' }).isLength({ max: 255 }),
];
