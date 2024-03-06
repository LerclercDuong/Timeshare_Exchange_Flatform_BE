const axios = require('axios')
const {reservationServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');


class ReservationController {
    async AcceptReservationByOwner(req, res, next) {
        try {
            const {reservationId} = req.params;
            const confirmedData = await reservationServices.AcceptReservationByOwner(reservationId)
            if(confirmedData){
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: `Accept success for reservation ${confirmedData.reservation_id}`
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
    async GetRentRequestOfTimeshare(req, res, next) {
        try {
            const { timeshareId } = req.params;
            const result = await reservationServices.GetRentRequestOfTimeshare(timeshareId);
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: "Reservation found"
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
    async GetReservationOfPost(req, res, next) {
        try {
            const type = req.query.type;
            const {timeshareId} = req.params;
            const result = await reservationServices.GetReservationOfPost(timeshareId, type);
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
            const type = req.query.type;
            const reservedData = req.body;
            console.log(reservedData)
            const reservationSaved = await reservationServices.MakeReservation(type, reservedData);
            if (reservationSaved) {
                // req.reservation = reservationSaved;
                // next();
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Reservation created'
                    },
                    data: reservationSaved
                });
            }
        } catch (error) {
            console.log(error)
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

    async MakeExchange(req, res, next) {
        try {
            const {timeshareId} = req.params
            const {myTimeshareId, type, userId, fullName, phone, email, amount} = req.body;
            const exchangeData = await reservationServices.MakeExchange(
                timeshareId, 
                myTimeshareId, 
                type, 
                userId, 
                fullName, 
                phone, 
                email, 
                amount
                );
            console.log(exchangeData)
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Exchange status "pending"'
                },
                data: exchangeData
            });
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

    async ConfirmExchange(req, res, next) {
        try {
            const { exchangeId } = req.params;
            if (!exchangeId) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: {
                        code: StatusCodes.BAD_REQUEST,
                        message: 'Missing exchangeId parameter'
                    },
                    data: null
                });
            }
            const confirmedExchangeData = await reservationServices.ConfirmExchange(exchangeId);
            if (confirmedExchangeData) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: `Confirm success for exchange`
                    },
                    data: confirmedExchangeData
                });
            }
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: 'Confirm fail'
                },
                data: null
            });
        }
    }
    async ConfirmReservationByToken(req, res, next) {
        try {
            const token = req.query.token;
            console.log(token)
            const reservationId = req.params.reservationId;
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'Bad request, must have token as a parameter'});
            } else {
                const confirmData = await reservationServices.ConfirmReservationByToken(reservationId, token)
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Verify complete'
                    },
                    data: confirmData
                });
            }
            // } else res.status(StatusCodes.BAD_REQUEST).json({message: 'Token is invalid or expired'});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReservationController;