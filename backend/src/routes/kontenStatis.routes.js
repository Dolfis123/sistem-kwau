const router = require('express').Router();
const ctrl = require('../controllers/kontenStatis.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/pengaturan', ctrl.getPengaturan); // publik: WA utama, jam operasional, dsb.
router.put('/pengaturan', auth, role(), ctrl.setPengaturan); // superadmin saja (role() tanpa argumen)
router.get('/admin/semua', auth, role('admin_konten', 'pegawai_kampung'), ctrl.listAdmin);
router.put('/', auth, role('admin_konten', 'pegawai_kampung'), ctrl.upsert);
router.get('/:slug', ctrl.getBySlug);

module.exports = router;
