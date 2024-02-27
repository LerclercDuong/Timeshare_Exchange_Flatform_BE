const express = require('express');
const paymentController = require('../../controllers/v2/payment.controller')
const router = express.Router();

router.post('/create-payment', paymentController.CreatePayment);
router.post('/execute-payment', paymentController.ExecutePayment)
router.post('/create-payment-vnpay', paymentController.CreateVNPay);
router.get('/vnpay_return', paymentController.VNPayReturn);
module.exports = router;