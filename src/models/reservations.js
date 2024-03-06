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
    is_confirmed: {
        type: Boolean,
        default: false,
        required: true
    },
    is_accepted_by_owner: {
        type: Boolean,
        default: false,
        required: true,
    },
    status: {
        type: String,
        enum: ['Agreement phase', 'Payment phase', 'Finished', 'Canceled', 'Refunded'],
        default: 'Agreement phase',
    },
    confirmed_at: {
        type: Date,
        require: false
    }
});

reservationSchema.plugin(mongooseDelete);
// Middleware to handle when is_accepted_by_owner changes to true
reservationSchema.pre('updateOne', async function (next) {
    const { is_accepted_by_owner } = this.getUpdate().$set;

    if (is_accepted_by_owner) {
        // Update the 'status' field to 'Payment phase'
        this.set({ status: 'Payment phase' });
    }

    next();
});

// Middleware to handle when isPaid changes to true
reservationSchema.pre('updateOne', async function (next) {
    const { isPaid } = this.getUpdate().$set;

    if (isPaid) {
        this.set({ status: 'Finished' });
    }

    next();
});
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
reservationSchema.path('timeshareId').validate(async function (value) {
    // Fetch the associated timeshare
    const timeshare = await mongoose.model('Timeshares').findById(value);

    // Check if the current_owner of the timeshare is the same as the userId in the reservation
    if (timeshare && timeshare.current_owner.equals(this.userId)) {
        throw new Error('The owner of the timeshare cannot be the same as the reservation user.');
    }

    return true;
}, 'Validation error');

const Reservation = mongoose.model('Reservations', reservationSchema);

module.exports = Reservation;
