const router = require('express').Router();
const ctrl = require('../controllers/faq.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', ctrl.listPublik);
router.post('/', auth, role('admin_konten'), ctrl.create);
router.put('/:id', auth, role('admin_konten'), ctrl.update);
router.delete('/:id', auth, role('admin_konten'), ctrl.remove);

module.exports = router;
