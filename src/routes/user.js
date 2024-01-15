const express = require('express');
const router = express.Router();
const User = require('../api/user');

router.get('/id/:userId', User.GetUserById);
router.get('/username/:username', User.GetUserByUsername);

module.exports = router;