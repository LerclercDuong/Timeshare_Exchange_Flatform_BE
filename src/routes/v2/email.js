const express = require('express');
const router = express.Router();
const {auth: CheckAuth} = require('../../middlewares/auth');
const emailController = require('../../controllers/v2/email.controller');


router.get('/send-verification-email', CheckAuth, emailController.SendVerificationCode);
router.get('/verify-email', emailController.VerifyEmailVerification);
router.post('/request-password-reset', emailController.SendPasswordRecoveryEmail);
router.post('/reset-password', emailController.VerifyPasswordReset);
router.post('/send-confirm-reservation-email', emailController.SendConfirmReservationEmail);

module.exports = router;