const axios = require('axios')
const {exchangeServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');


class ExchangeController {
    async MakeExchange(req, res, next) {
        try {
            const {timeshareId} = req.params
            const {myTimeshareId, type, userId, fullName, phone, email, amount, status, request_at, country,
                street,
                city,
                province,
                zipCode,} = req.body;
            const exchangeData = await exchangeServices.MakeExchange(
                timeshareId, 
                myTimeshareId, 
                type, 
                userId, 
                fullName, 
                phone, 
                email, 
                amount,
                status,
                request_at,
                country,
                street,
                city,
                province,
                zipCode,
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
            const confirmedExchangeData = await exchangeServices.ConfirmExchange(exchangeId);
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
    async CancelExchange(req, res, next) {
        try {
            const { exchangeId } = req.params;
            const canceledExchangeData = await exchangeServices.CancelExchange(exchangeId);
            if (canceledExchangeData) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: `Confirm success for exchange`
                    },
                    data: canceledExchangeData
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

    async GetExchangeRequestOfTimeshare(req, res, next) {
        try {
            const { timeshareId } = req.params;
            const result = await exchangeServices.GetExchangeRequestOfTimeshare(timeshareId);
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
    async GetExchangeById(req, res, next) {
        try {
            const {exchangeId} = req.params;
            const result = await exchangeServices.GetExchangeById(exchangeId);
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: "Exchange found"
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
    
}

module.exports = new ExchangeController;