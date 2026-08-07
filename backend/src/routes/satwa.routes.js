const router = require('express').Router();
const ctrl = require('../controllers/satwa.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', ctrl.listPublik);
router.post('/', auth, role('admin_konten'), upload.single('foto'), ctrl.create);
router.put('/:id', auth, role('admin_konten'), upload.single('foto'), ctrl.update);
router.delete('/:id', auth, role('admin_konten'), ctrl.remove);

module.exports = router;
