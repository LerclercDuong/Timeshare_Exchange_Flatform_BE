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
    async DenyReservationByOwner(req, res, next) {
        try {
            const {reservationId} = req.params;
            const confirmedData = await reservationServices.DenyReservationByOwner(reservationId)
            if(confirmedData){
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: `Deny for reservation ${confirmedData.reservation_id}`
                    },
                    data: confirmedData
                });
            }
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: {
                    code: res.statusCode,
                    message: 'Error in deny process'
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
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: error.message
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
    async CancelMyRentalRequest(req, res, next) {
        try {
            const { reservationId } = req.params;
    
            const canceled = await reservationServices.CancelMyRentalRequest(reservationId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Canceled'
                },
                data: canceled
            });
        } catch (error) {
            console.error('Error deleting exchange:', error);
            res.status(StatusCodes.NO_CONTENT).json({
                status: {
                    code: res.statusCode,
                    message: 'Cancel failed'
                }
            });
        }
    }
    async DeleteMyRentalRequest(req, res, next) {
        try {
            const { reservationId } = req.params;
    
            const deletedRental = await reservationServices.DeleteMyRentalRequest(reservationId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Deleted'
                },
                data: deletedRental
            });
        } catch (error) {
            console.error('Error deleting exchange:', error);
            res.status(StatusCodes.NO_CONTENT).json({
                status: {
                    code: res.statusCode,
                    message: 'Delete failed'
                }
            });
        }
    }
    
}

module.exports = new ReservationController;