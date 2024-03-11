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

const transactionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    app_paymentId: {
        type: String,
        required: false,
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservations',
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
    // payment_deadline: {
    //     type: Date,
    //     default: () => Date.now() + 30 * 1000, // Set default value to current time + 30 seconds
    //     expires: 30
    // },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
transactionSchema.pre('save', function (next) {
    const method = this.method.name;
    this.method.logoImg = logoImages[method];
    next();
});

const Transaction = mongoose.model('Transactions', transactionSchema);

module.exports = Transaction;
