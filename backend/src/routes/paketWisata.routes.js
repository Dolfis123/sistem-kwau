const router = require('express').Router();
const ctrl = require('../controllers/paketWisata.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/paketWisata.validator');

// Publik
router.get('/', ctrl.listPublik);
router.get('/:id', ctrl.detailPublik);

// Admin Konten
router.get('/admin/semua', auth, role('admin_konten'), ctrl.listAdmin);
router.post('/', auth, role('admin_konten'), upload.single('foto_cover'), v.createUpdate, validate, ctrl.create);
router.put('/:id', auth, role('admin_konten'), upload.single('foto_cover'), v.createUpdate, validate, ctrl.update);
router.delete('/:id', auth, role('admin_konten'), ctrl.remove);
router.post('/:id/foto', auth, role('admin_konten'), upload.array('foto', 10), ctrl.tambahFoto);
router.delete('/:id/foto/:fotoId', auth, role('admin_konten'), ctrl.hapusFoto);
router.put('/:id/ketersediaan', auth, role('admin_konten', 'admin_reservasi'), v.ketersediaan, validate, ctrl.aturKetersediaan);

module.exports = router;
