// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const authCtrl = require('../controllers/authController');
const authMw   = require('../middlewares/auth');

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);

// ** NUEVO **
router.get('/me', authMw, authCtrl.me);

module.exports = router;
