const router = require('express').Router();
const ctrl = require('../controllers/reservasi.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/reservasi.validator');
const honeypot = require('../middlewares/honeypot.middleware');
const { publicFormLimiter } = require('../middlewares/rateLimit.middleware');

// Publik: kirim reservasi (rate limit + honeypot + validasi)
router.post('/', publicFormLimiter, honeypot, v.create, validate, ctrl.create);

// Admin Reservasi
router.get('/', auth, role('admin_reservasi'), ctrl.list);
router.get('/kalender', auth, role('admin_reservasi'), ctrl.kalender);
router.get('/export/excel', auth, role('admin_reservasi'), ctrl.exportExcel);
router.get('/:id', auth, role('admin_reservasi'), ctrl.detail);
router.put('/:id/status', auth, role('admin_reservasi'), v.updateStatus, validate, ctrl.updateStatus);

module.exports = router;
