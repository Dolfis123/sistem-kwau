const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/admin.validator');

// role() tanpa argumen = hanya superadmin yang lolos
router.get('/', auth, role(), ctrl.list);
router.post('/', auth, role(), v.create, validate, ctrl.create);
router.put('/:id', auth, role(), ctrl.update);
router.put('/:id/reset-password', auth, role(), ctrl.resetPassword);

module.exports = router;
