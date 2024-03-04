const TripModel = require("../../models/trips")
class TripService {
    async CheckInTrip(tripId){

    }
    async GetTripOfUser(userId) {
        return TripModel.find({userId: userId});
    }

    async CreateTripByTimeshareId(reservation){
        const newTrip = new TripModel({
            reservationId: reservation._id,
            userId: reservation.userId._id,
            resortId: reservation.timeshareId.resortId._id,
            unitId: reservation.timeshareId.unitId._id,
            check_in: reservation.timeshareId.start_date,
            check_out: reservation.timeshareId.end_date,
        });
        // Save the trip to the database
        return await newTrip.save();
    }


    async CreateTripByMyTimeshareId(exchange){
        const newTrip = new TripModel({
            reservationId: exchange._id,
            userId: exchange.userId._id,
            resortId: exchange.timeshareId.resortId._id,
            unitId: exchange.timeshareId.unitId._id,
            check_in: exchange.timeshareId.start_date,
            check_out: exchange.timeshareId.end_date,
        });
        // Save the trip to the database
        return await newTrip.save();
    }

    async CreateTripExchange(exchange){
        const newTrip1 = new TripModel({
            reservationId: exchange._id,
            userId: exchange.timeshareId.current_owner._id,
            resortId: exchange.myTimeshareId.resortId._id,
            unitId: exchange.myTimeshareId.unitId._id,
            check_in: exchange.myTimeshareId.start_date,
            check_out: exchange.myTimeshareId.end_date,
        });
        // Save the trip to the database
        return await newTrip1.save();
    }
}

module.exports = new TripService;
