const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");
const PostModel = require("../../models/posts")
const TripModel = require("../../models/trips")
class TripService {
    async CheckInTrip(tripId){

    }
    async GetTripOfUser(userId) {
        return TripModel.find({'reservation.userId._id': userId});
    }
    async CreateTrip(reservationId){
        const reservationExists = await ReservationModel.exists({ _id: reservationId });
        if (!reservationExists) {
            throw new Error('Reservation not found');
        }
        // Create a new trip
        const newTrip = new TripModel({
            reservation: reservationId,
        });
        // Save the trip to the database
        return await newTrip.save();
    }
}

module.exports = new TripService;
