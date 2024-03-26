const {StatusCodes} = require('http-status-codes');
const paypal = require('paypal-rest-sdk');
const {paymentServices, resortServices} = require('../../services/v2')
const {query} = require("../../utils/query");
const {PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY} = process.env;

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AbLzuAnKDkeDPzzHxZfjui7re33GfDZli7MzPCnE3IdPoMDRvdU2l81Foh_EIy-0fHPlespJbI5WloJq',
    'client_secret': 'ECLdKypLFcwwl_Ioaa3c7lJW7KzPDv5gLO5zruvz4Mamh1D5-Y1qcgLQX5cGtAu6RbGVR8AHeugc9Ok8'
});

class PaymentController {
    async PayoutThroughPaypal(req, res, next) {
        const {rental_transaction_id, receiver, amount} = req.body;
        try {
            const accessToken = await paymentServices.GetPaypalAccessToken();
            const result = await paymentServices.Payout(accessToken, {rental_transaction_id, receiver, amount});
            console.log(result)
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Payout successs to' + receiver
                },
                data: result
            })
        } catch (err) {

        }
    }

    async SummarizeFinancial(req, res, next) {
        try {
            const data = await paymentServices.SummarizeFinancial(req.params.userId)
            console.log(data)
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Financial summary'
                },
                data: data
            })
        } catch (err) {

        }
    }

    async GetTransactionHistory(req, res, next) {
        try {
            const results = await paymentServices.GetTransactionHistory(req.params.userId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Query rental transaction'
                },
                data: results
            })
        } catch (err) {
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: err.message
                }
            })
        }
    }

    async GetRentalTransaction(req, res, next) {
        try {
            const filter = query(req.query, ['reservationId', 'sender', 'receiver']);
            const options = query(req.query, ['page']);
            const results = await paymentServices.QueryRentalTransaction(filter, options);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Query rental transaction'
                },
                data: results
            })
        } catch (err) {
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: err.message
                }
            })
        }

    }

    async CreatePayment(req, res, next) {
        try {
            const result = await paymentServices.CreatePayPalPayment(req.body);
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Create payment success'
                    },
                    data: result
                });
            }
        } catch (error) {
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: error.message
                },
                data: null
            })
        }
    }

    async ExecutePayment(req, res, next) {
        try {
            const result = await paymentServices.ExecutePayPalPayment(req.body);
            console.log(result)
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Payment success'
                    },
                    data: result
                });
            }
        } catch (error) {
            res.status(error.status).json({
                status: {
                    code: error.status,
                    message: error.message
                },
            });
        }
    }

    async CreateVNPay(req, res) {
        try {
            const {servicePackId} = req.body;
            const {userId} = req.body;
            const paymentUrl = await paymentServices.CreateVNPay(req, userId, servicePackId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'payment data'
                },
                data: paymentUrl
            })
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }


    async VNPayReturn(req, res) {
        try {
            const {userId} = req.params;
            const vnpayReturn = await paymentServices.VNPayReturn(req, res, userId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'payment data'
                },
                data: vnpayReturn
            });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }

    async GetOrderPaymentInfo(req, res, next) {
        try {
            const {sender, reservationId} = req.query;
            const data = await paymentServices.GetOrderPaymentInfo(sender, reservationId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'payment data'
                },
                data: data
            });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }

    async GetTransaction(req, res, next) {
        try {
            const {ownerId} = req.params;
            const data = await paymentServices.GetRenterTransactionOfOwner(ownerId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Payment data'
                },
                data: data
            });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }
    async GetTotalAmount(req, res, next) {
        try {
            const data = await paymentServices.GetTotalAmount();
            res.status(StatusCodes.OK).json(data
            );
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }
    async GetTotalServicePack(req, res, next) {
        try {
            const data = await paymentServices.GetTotalServicePack();
            res.status(StatusCodes.OK).json(data);
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }
    async CountAllUsers(req, res, next) {
        try {
            const data = await paymentServices.CountAllUsers();
            res.status(StatusCodes.OK).json(data);
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }
    async GetAllPaymentUpgrade(req, res, next) {
        try {
            const data = await paymentServices.GetAllPaymentUpgrade();
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Payment data'
                },
                data: data
            });
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }
    
    
    
}

module.exports = new PaymentController;