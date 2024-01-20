const express = require('express');
const router = express.Router();
const User = require('../api/user');

router.get('/id/:userId', User.GetUserById);
router.get('/username/:username', User.GetUserByUsername);
router.get('/get-all', User.GetAllUsers);




module.exports = router;