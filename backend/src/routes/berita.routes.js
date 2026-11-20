const router = require('express').Router();
const ctrl = require('../controllers/berita.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', ctrl.listPublik);
router.get('/admin/semua', auth, role('pegawai_kampung', 'admin_pertanian'), ctrl.listAdmin);
router.get('/:id', ctrl.detailPublik);
router.post('/', auth, role('pegawai_kampung', 'admin_pertanian'), upload.single('foto_sampul'), ctrl.create);
router.put('/:id', auth, role('pegawai_kampung', 'admin_pertanian'), upload.single('foto_sampul'), ctrl.update);
router.delete('/:id', auth, role('pegawai_kampung', 'admin_pertanian'), ctrl.remove);

module.exports = router;
