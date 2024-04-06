const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Enum for allowed payment methods
const paymentMethods = ['paypal', 'vnpay', 'visa'];

// Enum for logo images corresponding to each payment method
const logoImages = {
    paypal: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png',
    vnpay: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png',
    visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
};

const withDrawTransactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    rental_transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental_transactions',
        required: true,
    },
    method: {
        name: {
            type: String,
            enum: paymentMethods, // Enum with allowed values
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
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
withDrawTransactionSchema.pre('save', function (next) {
    const method = this.method.name;
    this.method.logoImg = logoImages[method];
    next();
});

const Withdraw_transactions = mongoose.model('Withdraw_transactions', withDrawTransactionSchema);

module.exports = Withdraw_transactions;
