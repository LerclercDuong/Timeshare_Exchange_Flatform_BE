const express = require('express');
const router = express.Router();
const User = require('../../controllers/v2/user.controller');
const {auth: CheckAuth} = require('../../middlewares/auth');

router.get('/', User.GetUsers);
router.get('/:userId', User.GetUserById);
router.get('/username/:username', User.GetUserByUsername);
router.get('/users', User.GetAllUsers);
router.post('/update/:userId', CheckAuth, User.UpdateUser);
router.post('/change-password', CheckAuth, User.ChangePassword);

module.exports = router;