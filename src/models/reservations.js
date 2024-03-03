const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const reservationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    timeshareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timeshares',
        required: true,
    },
    myTimeshareId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timeshares',
        required: false,
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requests',
    },
    verificationCode: {
        type: Number,
    },
    type: {
        type: String,
        enum : ['rent', 'exchange'],
        default: ['rent'],
        required: true,
    },
    reservationDate: {
        type: Date,
    },
    fullName: {
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
    address: {
        street: {
            type: String,
            // required: true,
        },
        city: {
            type: String,
            // required: true,
        },
        province: {
            type: String,
            // required: true,
        },
        zipCode: {
            type: String,
            // required: true,
        },
        country: {
            type: String,
            // required: true,
        },
    },
    amount: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        // required: true,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending',
    },
    confirmed_at: {
        type: Date,
        require: false
    }
});

reservationSchema.plugin(mongooseDelete);
reservationSchema.pre('find', async function (docs, next) {
    this.populate({
        path: "timeshareId myTimeshareId userId"
    })
});
reservationSchema.pre('findOne', async function (docs, next) {
    this.populate({
        path: "timeshareId myTimeshareId userId"
    })
});
const Reservation = mongoose.model('Reservations', reservationSchema);

module.exports = Reservation;
