const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jsbarcode = require('jsbarcode');

const tripSchema = new Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservations',
        required: true,
    },
    barcode: {
        type: String,
        required: true,
        unique: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

tripSchema.pre('save', async function (next) {
    try {
        // Generate barcode based on the reservationId
        const reservationIdString = this.reservation.toString();
        jsbarcode(this.barcode, reservationIdString, {
            format: 'CODE128',
            width: 2,
            height: 40,
        });

        next();
    } catch (error) {
        console.log(error)
        next(error);
    }
});

const Trip = mongoose.model('Trips', tripSchema);

module.exports = Trip;
