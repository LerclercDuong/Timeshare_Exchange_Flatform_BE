const axios = require('axios')
const {reservationServices, tripServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');


class TripController {
    async GetTripOfUser(req, res, next) {
        const {userId} = req.params;
        try {
            const tripData = await tripServices.GetTripOfUser(userId);
            if(tripData){
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Trip found'
                    },
                    data: tripData
                })
            }
        } catch(err) {
            console.log(err)
            res.status(StatusCodes.NO_CONTENT).json({
                status: {
                    code: res.statusCode,
                    message: 'Trip not found'
                },
                data: null
            })
        }
    }

}

module.exports = new TripController;