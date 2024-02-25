const axios = require('axios')
const {reservationServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');


class ReservationController {
    async ConfirmReservation(req, res, next) {
        try {
            const {reservationId} = req.params;
            const confirmedData = await reservationServices.ConfirmReservation(reservationId)
            if(confirmedData){
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: `Confirm success for reservation ${confirmedData.reservation_id}`
                    },
                    data: confirmedData
                });
            }
        } catch (error) {
            console.log(error)
            res.status(StatusCodes.BAD_REQUEST).json({
                status: {
                    code: res.statusCode,
                    message: 'Confirm fail'
                },
                data: null
            });
        }
    }

    async GetReservationOfPost(req, res, next) {
        try {
            const {postId} = req.params;
            const result = await reservationServices.GetReservationOfPost(postId);
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: "Reserve found"
                    },
                    data: result
                });
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Error'
                },
                data: null
            });
        }
    }

    async GetReservationOfUser(req, res, next) {
        try {
            const {userId} = req.params;
            const result = await reservationServices.GetReservationOfUser(userId);
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: "Reserve found"
                    },
                    data: result
                });
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Error'
                },
                data: null
            });
        }
    }

    async GetReservationById(req, res, next) {
        try {
            const {reservationId} = req.params;
            const result = await reservationServices.GetReservationById(reservationId);
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: "Reserve found"
                    },
                    data: result
                });
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Error'
                },
                data: null
            });
        }
    }

    async MakeReservation(req, res, next) {
        try {
            const reservedData = req.body;
            const reservationSaved = await reservationServices.MakeReservation(reservedData);
            if (reservationSaved) {
                req.reservation = reservationSaved
                next()
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Error'
                },
                data: null
            });
        }
    }
    async ConfirmRent(req, res, next) {
        try {
            const {reservationId} = req.params;
            const confirmedReservation = await reservationServices.ConfirmRent(reservationId);
            res.json(confirmedReservation);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new ReservationController;