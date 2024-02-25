const TripModel = require("../../models/trips")
class TripService {
    async CheckInTrip(tripId){

    }
    async GetTripOfUser(userId) {
        return TripModel.find({userId: userId});
    }

    async CreateTrip(reservation){
        const newTrip = new TripModel({
            reservationId: reservation._id,
            userId: reservation.userId._id,
            resortId: reservation.postId.resortId._id,
            unitId: reservation.postId.unitId._id,
            check_in: reservation.postId.start_date,
            check_out: reservation.postId.end_date,
        });
        // Save the trip to the database
        return await newTrip.save();
    }
}

module.exports = new TripService;
