const router = require('express').Router();
const ctrl = require('../controllers/kontak.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/kontak.validator');
const honeypot = require('../middlewares/honeypot.middleware');
const { publicFormLimiter } = require('../middlewares/rateLimit.middleware');

router.post('/', publicFormLimiter, honeypot, v.create, validate, ctrl.create);
router.get('/', auth, role('admin_reservasi', 'admin_konten'), ctrl.list);
router.put('/:id/dibaca', auth, role('admin_reservasi', 'admin_konten'), ctrl.tandaiDibaca);

module.exports = router;
