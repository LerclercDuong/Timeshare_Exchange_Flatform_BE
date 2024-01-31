const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v2/auth.controller');

router.post('/register', authController.Register);
router.post('/login', authController.Login);
router.post('/refresh-token', authController.RefreshAccessToken);
router.patch('/isAuth', authController.CheckIsAuth);

module.exports = router;