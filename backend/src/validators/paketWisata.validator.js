const { body } = require('express-validator');

exports.createUpdate = [
  body('nama').trim().isLength({ min: 3, max: 150 }).withMessage('Nama paket wajib diisi (3-150 karakter).'),
  body('kategori').isIn(['trekking', 'birdwatching', 'homestay', 'kombinasi']).withMessage('Kategori tidak valid.'),
  body('harga').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('Harga tidak valid.'), // V4: opsional, internal saja
  body('kapasitas').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('Kapasitas minimal 1.'),
  body('status').optional({ values: 'falsy' }).isIn(['aktif', 'nonaktif']),
];

exports.ketersediaan = [
  body('tanggal').isISO8601().withMessage('Tanggal tidak valid.'),
  body('kuota_tersedia').isInt({ min: 0 }).withMessage('Kuota tidak valid.'),
  body('status').optional({ values: 'falsy' }).isIn(['tersedia', 'penuh', 'ditutup']),
];
