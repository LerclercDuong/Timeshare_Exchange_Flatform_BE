const express = require('express');
const router = express.Router();
const emailController = require('../../controllers/v2/email.controller');


router.get('/send-verification-email', emailController.SendVerificationCode);
router.get('/verify-email', emailController.VerifyEmail);

module.exports = router;