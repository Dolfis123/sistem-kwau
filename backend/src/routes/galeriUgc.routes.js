const router = require('express').Router();
const ctrl = require('../controllers/galeriUgc.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/galeriUgc.validator');
const honeypot = require('../middlewares/honeypot.middleware');
const { publicFormLimiter } = require('../middlewares/rateLimit.middleware');

// Publik
router.get('/', ctrl.listPublik);
router.post('/', publicFormLimiter, upload.array('foto', 2), honeypot, v.create, validate, ctrl.create);

// Admin Konten (moderasi)
router.get('/admin/antrean', auth, role('admin_konten'), ctrl.listAdmin);
router.get('/admin/riwayat', auth, role('admin_konten'), ctrl.riwayat);
router.get('/admin/:id', auth, role('admin_konten'), ctrl.detailAdmin);
router.put('/admin/:id/approve', auth, role('admin_konten'), v.moderasi, validate, ctrl.approve);
router.put('/admin/:id/reject', auth, role('admin_konten'), v.moderasi, validate, ctrl.reject);
router.delete('/admin/:id', auth, role('admin_konten'), v.moderasi, validate, ctrl.remove);

module.exports = router;
