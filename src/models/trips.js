const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    resortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resorts',
        required: true,
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Units',
        required: true,
    },
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservations',
        required: true,
    },
    trip_code: {
        type: String,
        required: false,
    },
    romon_code: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

tripSchema.pre('find', async function (docs, next) {
    this.populate({
        path: "resortId userId unitId reservationId"
    })
});
tripSchema.pre('findOne', async function (docs, next) {
    this.populate({
        path: "resortId userId unitId reservationId"
    })
});
const Trip = mongoose.model('Trips', tripSchema);

module.exports = Trip;
