const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");

class ReservationService {
    async GetReservationById(id){
        return await ReservationModel.findById(id).lean();
    }
    async MakeReservation(data) {
        const {
            userId, postId, reservationDate, fullName, phone, email, country,
            street,
            city,
            province,
            zipCode, amount
        } = data;
        const address = {country, street, city, province, zipCode}
        // Create a new reservation instance
        const newReservation = new ReservationModel({
            userId,
            postId,
            reservationDate,
            fullName,
            phone,
            email,
            address,
            amount,
            isPaid: false,
            status: 'pending',
        });
        return await newReservation.save().catch();
    }

    async ConfirmRent(reservationId) {
        try {
            const reservation = await ReservationModel.findById(reservationId);

            if (!reservation) {
                throw new Error('Reservation not found');
            }
            reservation.status = 'confirmed';
            await reservation.save();

            return reservation;
        } catch (error) {
            throw new Error('Error confirming reservation');
        }
    }

}

module.exports = new ReservationService;
