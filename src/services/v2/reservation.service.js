const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");

class ReservationService {
    async RentTimeshare (userId, timeshareId, requestId ,roomType, checkInDate, checkOutDate, status) {
        try {
            // Add any additional processing logic here
            const reservationData = {
                userId: userId, 
                timeshareId: timeshareId,
                requestId: requestId,
                roomType: roomType,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                status: status,
            };
            const newReservation = new ReservationModel({...reservationData});
            await newReservation.save();

            await TimeshareModel.findByIdAndUpdate(timeshareId, { availability: false });
            await RequestModel.findByIdAndUpdate(requestId, { status: 'confirmed' });


            return newReservation;
        } catch (error) {
            throw new ApiError('Error processing rent request', 500); 
        }
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
