// PERBAIKAN #2b: honeypot anti-bot.
// Frontend menambahkan input tersembunyi bernama "website" (display:none).
// Manusia tidak melihatnya, bot biasanya mengisinya.
// Jika terisi, kirim respons "sukses" palsu agar bot tidak tahu terdeteksi.
module.exports = (req, res, next) => {
  if (req.body && typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    return res.status(201).json({ success: true, message: 'Berhasil', data: null });
  }
  next();
};
