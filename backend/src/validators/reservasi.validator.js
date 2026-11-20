const { body } = require('express-validator');
const { m } = require('../utils/bahasa');

// Nomor WhatsApp: format Indonesia (08xx / 628xx / +628xx) ATAU internasional
// (+44..., +61..., dst.) — sebagian besar pengunjung Kwau adalah turis mancanegara.
const bersihkanNomor = (v) => String(v || '').replace(/[\s\-().]/g, '');
const nomorValid = (v) => /^08\d{7,11}$/.test(v) || /^\+?[1-9]\d{7,14}$/.test(v);
// Disimpan sebagai angka saja dengan kode negara: 0812... → 62812..., +44 79... → 4479...
const normalisasiNomor = (v) => (v.startsWith('0') ? `62${v.slice(1)}` : v.replace(/^\+/, ''));

exports.create = [
  body('paket_wisata_id').isInt({ min: 1 }).withMessage(m('Paket wisata tidak valid.', 'Invalid tour package.')),
  body('nama_turis').trim().isLength({ min: 2, max: 100 })
    .withMessage(m('Nama wajib diisi (2-100 karakter).', 'Please enter your name (2-100 characters).')),
  body('no_wa').customSanitizer(bersihkanNomor)
    .custom(nomorValid)
    .withMessage(m(
      'Nomor WhatsApp tidak valid. Contoh: 081234567890 atau +44 7911 123456.',
      'Invalid WhatsApp number. Include your country code, e.g. +44 7911 123456.'
    ))
    .customSanitizer(normalisasiNomor),
  body('jumlah_peserta').isInt({ min: 1, max: 100 })
    .withMessage(m('Jumlah peserta minimal 1.', 'Number of guests must be at least 1.')),
  body('tanggal_kunjungan').isISO8601().withMessage(m('Tanggal kunjungan tidak valid.', 'Invalid visit date.'))
    .custom((v) => {
      // Bandingkan sebagai tanggal (YYYY-MM-DD) menurut WIT, bukan jam server
      const hariIni = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jayapura' }).format(new Date());
      return String(v).slice(0, 10) >= hariIni;
    })
    .withMessage(m('Tanggal kunjungan tidak boleh di masa lalu.', 'The visit date cannot be in the past.')),
  body('catatan').optional({ values: 'falsy' }).isLength({ max: 1000 })
    .withMessage(m('Catatan maksimal 1000 karakter.', 'Notes can be at most 1000 characters.')),
  body('bahasa').optional({ values: 'falsy' }).isIn(['id', 'en']),
  body('negara').optional({ values: 'falsy' }).trim().isLength({ max: 60 })
    .withMessage(m('Nama negara terlalu panjang.', 'Country name is too long.')),
];

exports.updateStatus = [
  body('status').isIn(['pending', 'lunas', 'selesai', 'batal']).withMessage('Status tidak valid.'),
];
