const router = require('express').Router();
const ctrl = require('../controllers/petaTitik.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/petaTitik.validator');

router.get('/', ctrl.listPublik);
router.get('/admin/semua', auth, role('admin_konten'), ctrl.listAdmin);
router.post('/', auth, role('admin_konten'), upload.single('foto'), v.createUpdate, validate, ctrl.create);
router.put('/:id', auth, role('admin_konten'), upload.single('foto'), v.createUpdate, validate, ctrl.update);
router.delete('/:id', auth, role('admin_konten'), ctrl.remove);

module.exports = router;
