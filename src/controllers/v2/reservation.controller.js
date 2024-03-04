const axios = require('axios')
const {reservationServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');
const emailService = require("../../services/v2/email.service");


class ReservationController {
    async ConfirmReservationByEmail(req, res, next) {
        try {
            const {reservationId} = req.params;
            const confirmToken = req.query.token;
            const confirmedData = await reservationServices.ConfirmReservationByEmail(reservationId);
            if (confirmedData) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: `User has confirmed for reservation ${confirmedData.reservation_id}`
                    },
                    data: confirmedData
                });
            }
        } catch (error) {
            console.log(error)
            res.status(StatusCodes.BAD_REQUEST).json({
                status: {
                    code: res.statusCode,
                    message: 'User fail to confirm this reservation'
                },
                data: null
            });
        }
    }

    async ConfirmReservation(req, res, next) {
        try {
            const {reservationId} = req.params;
            const confirmedData = await reservationServices.ConfirmReservation(reservationId)
            if (confirmedData) {
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
            console.log(reservationId);
            const result = await reservationServices.GetReservationById(reservationId);
            console.log(result);
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
            const reservationSaved = await reservationServices.MakeReservation(reservedData);
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

    async ConfirmReservationByToken(req, res, next) {
        try {
            const token = req.query.token;
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