const { body } = require('express-validator');

// PERBAIKAN #5c: validasi nomor WA format Indonesia (08xx / 628xx / +628xx)
const WA_REGEX = /^(\+?62|0)8[1-9][0-9]{6,10}$/;

exports.create = [
  body('paket_wisata_id').isInt({ min: 1 }).withMessage('Paket wisata tidak valid.'),
  body('nama_turis').trim().isLength({ min: 2, max: 100 }).withMessage('Nama wajib diisi (2-100 karakter).'),
  body('no_wa').trim().matches(WA_REGEX).withMessage('Nomor WhatsApp tidak valid. Contoh: 081234567890.'),
  body('jumlah_peserta').isInt({ min: 1, max: 100 }).withMessage('Jumlah peserta minimal 1.'),
  body('tanggal_kunjungan').isISO8601().withMessage('Tanggal kunjungan tidak valid.')
    .custom((v) => {
      const hariIni = new Date(); hariIni.setHours(0, 0, 0, 0);
      if (new Date(v) < hariIni) throw new Error('Tanggal kunjungan tidak boleh di masa lalu.');
      return true;
    }),
  body('catatan').optional({ values: 'falsy' }).isLength({ max: 1000 }).withMessage('Catatan maksimal 1000 karakter.'),
];

exports.updateStatus = [
  body('status').isIn(['pending', 'lunas', 'selesai', 'batal']).withMessage('Status tidak valid.'),
];
