const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/ringkasan', auth, ctrl.ringkasan);

module.exports = router;
