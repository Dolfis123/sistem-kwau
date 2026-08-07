const { body } = require('express-validator');

exports.createUpdate = [
  body('nama').trim().isLength({ min: 2, max: 100 }).withMessage('Nama titik wajib diisi.'),
  body('kategori').isIn(['pos_satwa', 'batas_hutan', 'homestay', 'tokoh']).withMessage('Kategori tidak valid.'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid.'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid.'),
];
