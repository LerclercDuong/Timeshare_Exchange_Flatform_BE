const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const reservationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true,
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requests',
        required: true,
    },
    verificationCode: {
        type: Number,
        required: true,
    },
    reservationDate: {
        type: Date,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending',
    }
});
reservationSchema.plugin(mongooseDelete);

const Reservation = mongoose.model('Reservations', reservationSchema);

module.exports = Reservation;
