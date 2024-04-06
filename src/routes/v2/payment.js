const express = require('express');
const paymentController = require('../../controllers/v2/payment.controller')
const router = express.Router();
const {auth: CheckAuth} = require('../../middlewares/auth');

router.post('/create-paypal-payment', CheckAuth, paymentController.CreatePayment);
router.post('/execute-paypal-payment', CheckAuth, paymentController.ExecutePayment);
router.post('/create-payment-vnpay', CheckAuth, paymentController.CreateVNPay);
router.get('/:userId/vnpay_return', paymentController.VNPayReturn);
router.get('/', CheckAuth, paymentController.GetOrderPaymentInfo);
router.get('/rental-transaction', paymentController.GetRentalTransaction);
router.get('/summarize-financial/:userId', paymentController.SummarizeFinancial);
router.post('/payout', paymentController.PayoutThroughPaypal);
router.get('/transaction-history/:userId', paymentController.GetTransactionHistory);
router.get('/total-amount', paymentController.GetTotalAmount)
router.get('/total-servicePack', paymentController.GetTotalServicePack)
router.get('/count-users', paymentController.CountAllUsers);
router.get('/all-payment-upgrade', paymentController.GetAllPaymentUpgrade);

module.exports = router;