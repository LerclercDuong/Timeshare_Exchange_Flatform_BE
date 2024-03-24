const express = require('express');
const paymentController = require('../../controllers/v2/payment.controller')
const router = express.Router();
const {auth: CheckAuth} = require('../../middlewares/auth');

router.post('/create-paypal-payment', CheckAuth, paymentController.CreatePayment);
router.post('/execute-paypal-payment', CheckAuth, paymentController.ExecutePayment)
router.post('/create-payment-vnpay', CheckAuth, paymentController.CreateVNPay);
router.get('/:userId/vnpay_return', paymentController.VNPayReturn);
router.get('/:userId/:reservationId', CheckAuth, paymentController.GetOrderPaymentInfo);

module.exports = router;