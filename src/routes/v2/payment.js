const express = require('express');
const paymentController = require('../../controllers/v2/payment.controller')
const router = express.Router();

router.post('/create-paypal-payment', paymentController.CreatePayment);
router.post('/execute-paypal-payment', paymentController.ExecutePayment)
router.post('/create-payment-vnpay', paymentController.CreateVNPay);
router.get('/:userId/vnpay_return', paymentController.VNPayReturn);
router.get('/:userId/:reservationId', paymentController.GetOrderPaymentInfo);

module.exports = router;