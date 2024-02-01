const express = require('express');
const router = express.Router();
// const User = require('../../controllers/v1/user');
const User = require('../../controllers/v2/user.controller');


router.get('/id/:userId', User.GetUserById);
router.get('/username/:username', User.GetUserByUsername);
router.get('/get-all', User.GetAllUsers);





module.exports = router;