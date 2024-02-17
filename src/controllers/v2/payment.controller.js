const userService = require('../../services/v2/user.service.js');
const authService = require('../../services/v2/auth.service.js');
const tokenService = require('../../services/v2/token.service');
const reservationService = require('../../services/v2/reservation.service')
const ReservationModel = require('../../models/reservations')
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
// Node v10.15.3
const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const os = require('os');
const paypal = require('paypal-rest-sdk');

const {PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY} = process.env;

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AbLzuAnKDkeDPzzHxZfjui7re33GfDZli7MzPCnE3IdPoMDRvdU2l81Foh_EIy-0fHPlespJbI5WloJq',
    'client_secret': 'ECLdKypLFcwwl_Ioaa3c7lJW7KzPDv5gLO5zruvz4Mamh1D5-Y1qcgLQX5cGtAu6RbGVR8AHeugc9Ok8'
});

class PaymentController {
    async CreatePayment(req, res, next) {
        try {
            const paymentInfo = req.reservation;
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `http://localhost:3000/post/${paymentInfo.postId}/book/review-order/${paymentInfo._id}`,
                    "cancel_url": "http://localhost:3000/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": paymentInfo.fullName,
                            "sku": paymentInfo._id.toString(), // Assuming reservationId is a string
                            "price": paymentInfo.amount.toString(), // Assuming amount is a string
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": paymentInfo.amount.toString(), // Assuming amount is a string
                    },
                    "description": `Reservation for ${paymentInfo.fullName}`
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.status(StatusCodes.OK).json({
                                status: {
                                    code: res.statusCode,
                                    message: 'Request successful'
                                },
                                data: payment.links[i].href
                            })
                        }
                    }
                }
            });

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
            const reservationId = req.body.reservationId;
            const payerId = req.body.PayerID;
            const paymentId = req.body.paymentId;
            const amount = req.body.totalAmount;
            console.log(amount)
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": amount.toString()
                    }
                }]
            };
            paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                if (error) {
                    // console.log('hello error')
                    // console.log(error.response);
                    throw error;
                } else {
                    // console.log('hello')
                    // console.log(JSON.stringify(payment));
                    await ReservationModel.updateOne(
                        {_id: reservationId},
                        {$set: {isPaid: true}}
                    )
                        .exec()
                        .then(result => {
                            console.log('isPaid updated successfully:', result);
                        })
                        .catch(err => {
                            console.error('Error updating isPaid:', err);
                        });
                }
            });

        } catch (error) {
            console.log(error.message);
        }

    }
}

module.exports = new PaymentController;