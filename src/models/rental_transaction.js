const mongoose = require('mongoose');
const paginate = require("./plugin/paginate");
const Schema = mongoose.Schema;

// Enum for allowed payment methods
const paymentMethods = ['paypal', 'vnpay', 'visa'];

// Enum for logo images corresponding to each payment method
const logoImages = {
    paypal: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png',
    vnpay: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png',
    visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
};

const rentalTransactionSchema = new Schema({
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservations',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    app_paymentId: {
        type: String,
        required: false,
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
    is_withdraw: {
        type: Boolean,
        default: false,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
rentalTransactionSchema.pre('save', function (next) {
    const method = this.method.name;
    this.method.logoImg = logoImages[method];
    next();
});
rentalTransactionSchema.pre('find', function(next) {
    this.populate({
        path: "sender"
    })
    next();
});
rentalTransactionSchema.pre('findOne', function(next) {
    this.populate({
        path: "sender"
    })
    next();
});
rentalTransactionSchema.plugin(paginate);

const Rental_transaction = mongoose.model('Rental_transactions', rentalTransactionSchema);

module.exports = Rental_transaction;
