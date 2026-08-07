const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const v = require('../validators/auth.validator');
const { loginLimiter } = require('../middlewares/rateLimit.middleware');

router.post('/login', loginLimiter, v.login, validate, ctrl.login);
router.get('/profil', auth, ctrl.profil);
router.put('/ganti-password', auth, v.gantiPassword, validate, ctrl.gantiPassword);

module.exports = router;
