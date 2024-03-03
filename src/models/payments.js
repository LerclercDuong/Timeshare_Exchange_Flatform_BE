const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    orderId: String,
    vnp_Version: String,
    vnp_Command: String,
    vnp_TmnCode: String,
    vnp_Locale: String,
    vnp_CurrCode: String,
    vnp_TxnRef: String,
    vnp_OrderInfo: String,
    vnp_OrderType: String,
    vnp_Amount: Number,
    vnp_ReturnUrl: String,
    vnp_IpAddr: String,
    vnp_CreateDate: String,
    vnp_BankCode: String,
    vnp_SecureHash: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    transactionStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    }
});

const Payment = mongoose.model('Payments', paymentSchema);

module.exports = Payment;
