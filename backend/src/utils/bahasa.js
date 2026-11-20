// Dukungan dua bahasa (Indonesia / English) untuk pesan API publik.
// Frontend mengirim header "X-Lang: en" saat pengunjung memakai bahasa Inggris.
const isEn = (req) => String(req?.headers?.['x-lang'] || '').toLowerCase().startsWith('en');

// pesan(req, 'teks Indonesia', 'English text')
const pesan = (req, id, en) => (isEn(req) ? en : id);

// Untuk express-validator: .withMessage(m('Teks ID', 'English text'))
const m = (id, en) => (value, { req }) => pesan(req, id, en);

module.exports = { isEn, pesan, m };
