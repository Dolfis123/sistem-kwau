// Menggabungkan seluruh sub-router ke prefix /api
const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/paket-wisata', require('./paketWisata.routes'));
router.use('/reservasi', require('./reservasi.routes'));
router.use('/galeri', require('./galeriUgc.routes'));
router.use('/galeri-kampung', require('./galeriKampung.routes'));
router.use('/pertanian', require('./pertanian.routes'));
router.use('/peta', require('./petaTitik.routes'));
router.use('/tokoh', require('./tokohPemandu.routes'));
router.use('/homestay', require('./homestay.routes'));
router.use('/satwa', require('./satwa.routes'));
router.use('/berita', require('./berita.routes'));
router.use('/faq', require('./faq.routes'));
router.use('/konten', require('./kontenStatis.routes'));
router.use('/kontak', require('./kontak.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
