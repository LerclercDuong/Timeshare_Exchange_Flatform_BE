const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const PostModel = require("../../models/posts");
const ReservationModel = require('../../models/reservations');
const RequestModel = require('../../models/requests')
const nodemailer = require("nodemailer");
const {uploadToS3} = require("../../utils/s3Store");
const ResortModel = require("../../models/resorts");
const paypal = require("paypal-rest-sdk");
const {StatusCodes} = require("http-status-codes");

class PaymentService {

    //return PayPal checkout link
    async CreatePayment(paymentInfo) {
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
                        return payment.links[i].href
                    }
                }
            }
        });
    }

    async ExecutePayment(){
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
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'payment data'
                    },
                    data: payment
                })
            }
        });
    }
    async RefundPayment(){

    }
}

module.exports = new PaymentService;