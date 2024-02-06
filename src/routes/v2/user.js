const express = require('express');
const router = express.Router();
const User = require('../../controllers/v2/user.controller');

router.get('/', User.GetUsers);
router.get('/:userId', User.GetUserById);
router.get('/username/:username', User.GetUserByUsername);
router.get('/users', User.GetAllUsers);

module.exports = router;