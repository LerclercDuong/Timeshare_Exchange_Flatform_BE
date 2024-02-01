const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");

class ReservationService {
    
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
