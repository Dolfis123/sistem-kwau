const router = require('express').Router();
const ctrl = require('../controllers/tokohPemandu.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/publik', ctrl.listPublik); // V2: publik
router.get('/', auth, role('admin_konten'), ctrl.listAdmin);
router.post('/', auth, role('admin_konten'), upload.single('foto'), ctrl.create);
router.put('/:id', auth, role('admin_konten'), upload.single('foto'), ctrl.update);
router.put('/:id/toggle-aktif', auth, role('admin_konten'), ctrl.nonaktifkan);
router.delete('/:id', auth, role('admin_konten'), ctrl.remove);

module.exports = router;
