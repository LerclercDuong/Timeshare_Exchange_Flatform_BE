const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentMethods = ['paypal', 'vnpay', 'visa'];

const logoImages = {
    paypal: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png',
    vnpay: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png',
    visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
};

const paymentSchema = new Schema({
    orderId: String,

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    app_paymentId: {
        type: String,
        required: false,
    },
    servicePackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServicePacks',
        required: true,
    },
    vnp_Locale: String,
    vnp_CurrCode: String,
    vnp_OrderInfo: String,
    vnp_BankCode: String,
    method: {
        name: {
            type: String,
            enum: paymentMethods,
            required: false,
        },
        logoImg: {
            type: String,
        },
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
});



paymentSchema.pre('save', function (next) {
    const method = this.method.name;
    this.method.logoImg = logoImages[method];
    next();
});
const Payment = mongoose.model('Payments', paymentSchema);

module.exports = Payment;


