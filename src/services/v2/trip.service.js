const moment = require("moment");

const TripModel = require("../../models/trips")
class TripService {
    async CheckInTrip(tripId){

    }
    async GetTripOfUser(userId) {
        return TripModel.find({userId: userId});
    }

    async CreateTripByTimeshareId(reservationId){
        let date = new Date();
        let trip_code = moment(date).format('MMDDHHmmssSSS');
        const newTrip = new TripModel({
            reservationId: reservationId._id,
            userId: reservationId.userId._id,
            resortId: reservationId.timeshareId.resortId._id,
            unitId: reservationId.timeshareId.unitId._id,
            check_in: reservationId.timeshareId.start_date,
            check_out: reservationId.timeshareId.end_date,
            phone: reservationId.phone,
            trip_code: trip_code,
        });
        // Save the trip to the database
        return await newTrip.save();
    }


    async CreateTripByMyTimeshareId(exchange){
        let date = new Date();
        let trip_code = moment(date).format('MMDDHHmmssSSS');
        const newTrip = new TripModel({
            reservationId: exchange._id,
            userId: exchange.userId._id,
            resortId: exchange.timeshareId.resortId._id,
            unitId: exchange.timeshareId.unitId._id,
            check_in: exchange.timeshareId.start_date,
            check_out: exchange.timeshareId.end_date,
            phone: exchange.phone,
            trip_code: trip_code,
        });
        // Save the trip to the database
        return await newTrip.save();
    }

    async CreateTripExchange(exchange){
        let date = new Date();
        let trip_code = moment(date).format('MMDDHHmmssSSS');
        const newTrip1 = new TripModel({
            reservationId: exchange._id,
            userId: exchange.timeshareId.current_owner._id,
            resortId: exchange.myTimeshareId.resortId._id,
            unitId: exchange.myTimeshareId.unitId._id,
            check_in: exchange.myTimeshareId.start_date,
            check_out: exchange.myTimeshareId.end_date,
            phone: exchange.phone,
            trip_code: trip_code,
        });
        // Save the trip to the database
        return await newTrip1.save();
    }
}

module.exports = new TripService;
