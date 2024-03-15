const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const exchangeSchema = new Schema({
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
    type: {
        type: String,
        enum : ['exchange'],
        default: 'exchange',
        required: true,
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
    
    is_canceled: {
        type: Boolean,
        default: false,
        required: true,
    },
    status: {
        type: String,
        enum: ['Agreement phase', 'Completed', 'Canceled', 'Expired' ],
        default: 'Agreement phase',
        required: true,
    },
    request_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    confirmed_at: {
        type: Date,
        require: false
    }
});

exchangeSchema.plugin(mongooseDelete);
// Middleware to handle when is_accepted_by_owner changes to true
exchangeSchema.pre('updateOne', async function (next) {
    const { is_accepted_by_owner } = this.getUpdate().$set;

    if (is_accepted_by_owner) {
        // Update the 'status' field to 'Payment phase'
        this.set({ status: 'Payment phase' });
    }

    next();
});

// Middleware to handle when isPaid changes to true
exchangeSchema.pre('updateOne', async function (next) {
    const { isPaid } = this.getUpdate().$set;

    if (isPaid) {
        this.set({ status: 'Finished' });
    }

    next();
});
exchangeSchema.pre('find', async function (docs, next) {
    this.populate({
        path: "timeshareId myTimeshareId userId"
    })
});
exchangeSchema.pre('findOne', async function (docs, next) {
    this.populate({
        path: "timeshareId myTimeshareId userId"
    })
});
exchangeSchema.path('timeshareId').validate(async function (value) {
    // Fetch the associated timeshare
    const timeshare = await mongoose.model('Timeshares').findById(value);

    // Check if the current_owner of the timeshare is the same as the userId in the reservation
    if (timeshare && timeshare.current_owner.equals(this.userId)) {
        throw new Error('The owner of the timeshare cannot be the same as the reservation user.');
    }

    return true;
}, 'Validation error');

const Exchange = mongoose.model('Exchanges', exchangeSchema);

module.exports = Exchange;
