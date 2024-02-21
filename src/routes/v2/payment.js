const express = require('express');
const paymentController = require('../../controllers/v2/payment.controller')
const router = express.Router();

router.post('/create-payment', paymentController.CreatePayment);
router.post('/execute-payment', paymentController.ExecutePayment)

module.exports = router;