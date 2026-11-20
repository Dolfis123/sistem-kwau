// PERBAIKAN #2a: rate limiting form publik & login (anti spam / brute force)
const rateLimit = require('express-rate-limit');

const { pesan: teks } = require('../utils/bahasa');

const pesan = (req) => ({
  success: false,
  message: teks(req, 'Terlalu banyak permintaan. Silakan coba lagi beberapa menit lagi.',
    'Too many requests. Please try again in a few minutes.'),
});

// Form publik: reservasi, UGC, kontak — maks 10 kiriman / 15 menit / IP
exports.publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: pesan,
});

// Login admin: maks 8 percobaan / 15 menit / IP
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: pesan,
});

// Limiter umum seluruh API (longgar)
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: pesan,
});
