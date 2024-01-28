const express = require('express');
const router = express.Router();
const Authentication = require('../../controllers/v1/authentication');

router.post('/register', Authentication.Register);
router.post('/login', Authentication.Login);
router.post('/refresh-token', Authentication.RefreshAccessToken);
router.patch('/isAuth', Authentication.CheckIsAuth);

module.exports = router;