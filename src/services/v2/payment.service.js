const moment = require("moment");
const TimeshareModel = require("../../models/timeshares");
const ReservationModel = require('../../models/reservations');
const RequestModel = require('../../models/requests')
const nodemailer = require("nodemailer");
const ApiError = require("../../utils/ApiError");
const paypal = require("paypal-rest-sdk");
const {StatusCodes} = require("http-status-codes");
const PaymentModel = require('../../models/payments')
const UserModel = require('../../models/users')
const ServicePackModel = require('../../models/servicePacks'); // Import model ServicePack
const RentalTransactionModel = require('../../models/rental_transaction')
const WidthdrawTransactionModel = require('../../models/withdraw_transactions')
const axios = require("axios");
const tripService = require("./trip.service");

var request = require('request');


class PaymentService {
    async SaveWithdrawTransaction(userId, rental_transactionId, amount) {
        try {
            // Update the associated rental transaction to mark it as withdrawn
            await RentalTransactionModel.findByIdAndUpdate(rental_transactionId, { is_withdraw: true });

            // Create and save the deposit transaction
            const withdrawTransaction = new WidthdrawTransactionModel({
                userId: userId,
                rental_transactionId: rental_transactionId,
                amount: amount,
            });
            await withdrawTransaction.save();

            return withdrawTransaction;
        } catch (error) {
            console.error('Error creating deposit transaction:', error);
            throw error;
        }
    }
    async GetPaypalAccessToken() {
        return new Promise((resolve, reject) => {
            request.post({
                uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
                headers: {
                    "Accept": "application/json",
                    "Accept-Language": "en_US",
                    "content-type": "application/x-www-form-urlencoded"
                },
                auth: {
                    'user': process.env.PAYPAL_CLIENT_KEY,
                    'pass': process.env.PAYPAL_SECRET_KEY,
                    // 'sendImmediately': false
                },
                form: {
                    "grant_type": "client_credentials"
                }
            }, function (error, response, body) {
                const responseBody = JSON.parse(body);
                resolve(responseBody.token_type + ' ' + responseBody.access_token);
            });
        })
    }
    async GetTransactionHistory(userId){
        // Find rental transactions where the user is either sender or receiver
        const rentalTransactions = await RentalTransactionModel.find({
            $or: [{ sender: userId }],
        }).populate('sender receiver');

        // Find deposit transactions where the user is the depositor
        const depositTransactions = await WidthdrawTransactionModel.find({
            userId: userId,
        });
        // Combine and sort transactions by timestamp
        const allTransactions = [...rentalTransactions, ...depositTransactions].sort(
            (a, b) => b.timestamp - a.timestamp
        );
        // Map transactions to the desired format
        const transactionHistory = allTransactions.map(transaction => {
            const type = transaction.sender && transaction.sender._id.equals(userId) ? 'deposit' : 'withdraw';
            return {
                date: transaction.timestamp,
                type: type,
                amount: transaction.amount,
            };
        });
        return transactionHistory;
    }

    async Payout(accessToken, data) {
        const {rental_transaction_id, receiver, amount} = data
        let requestBody = {
            "sender_batch_header": {
                "sender_batch_id": "Payouts_" + rental_transaction_id,
                "email_subject": "You have a payout!",
                "email_message": "You have received a payout for your rental timeshare! Thanks for using our service!",
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": amount.toString(),
                        "currency": "USD",
                    },
                    "note": "Thanks for your patronage!",
                    "sender_item_id": rental_transaction_id.toString(),
                    "receiver": receiver.toString(),
                    "alternate_notification_method": {
                        "phone": {
                            "country_code": "84",
                            "national_number": "0869381397",
                        },
                    },
                    "notification_language": "en-US",
                },
            ],
        };
        console.log(JSON.stringify(requestBody))
        const result = await axios.post('https://api-m.sandbox.paypal.com/v1/payments/payouts', JSON.stringify(requestBody), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken
            }
        }).then(function (response) {
            return response.data
        });
        if(result){
            const rentalTransaction = await RentalTransactionModel.findById(rental_transaction_id);
            return await this.SaveWithdrawTransaction(rentalTransaction.receiver, rental_transaction_id, amount)
        }
    }

    async SummarizeFinancial(userId) {
        const spend_rental_transactions = await RentalTransactionModel.find({sender: userId});
        const receive_rental_transactions = await RentalTransactionModel.find({receiver: userId});
        const widthdraw_transactions = await WidthdrawTransactionModel.find({userId: userId});
        const available_widthdraw_transactions = await RentalTransactionModel.find({
            receiver: userId,
            is_withdraw: false
        });

        // Calculate total amounts for rental and deposit transactions
        const totalReceiveAmount = receive_rental_transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        const totalSpendAmount = spend_rental_transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        const totalWidthdrawAmount = widthdraw_transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        const availableForWidthdrawAmount = available_widthdraw_transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

        // Return the summarized financial information
        return {
            totalReceiveAmount,
            totalSpendAmount,
            totalWidthdrawAmount,
            availableForWidthdrawAmount
        };
    }

    async GetOrderPaymentInfo(sender, reservationId) {
        return RentalTransactionModel.findOne({
            sender,
            reservationId,
        });
    }

    async QueryRentalTransaction(filter, options) {
        return RentalTransactionModel.paginate(filter, options);
    }

    async GetRentalTransactionByReceiver(userId) {
        return RentalTransactionModel.find({userId});
    }

    async WidthdrawThroughPayPal(transactionId, receiverId) {

    }

    async WidthdrawAllThroughPayPal(receiverId) {

    }

    async GetRentalTransactionByReceiver(receiverId) {
        // Find timeshares belonging to the owner
        const timeshares = await TimeshareModel.find({current_owner: ownerId});
        // Extract timeshare IDs
        const timeshareIds = timeshares.map(timeshare => timeshare._id);
        // Find reservations for these timeshares
        const reservations = await ReservationModel.find({timeshareId: {$in: timeshareIds}});
        // Extract reservation IDs
        const reservationIds = reservations.map(reservation => reservation._id);
        // Find transactions related to these reservations where deposit is false
        return TransactionModel.find({
            reservationId: {$in: reservationIds},
        });
    }

    async DepositToPaypal() {

    }

    //Return PayPal checkout link
    async CreatePayPalPayment(paymentInfo) {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `http://localhost:3000/timeshare/${paymentInfo.timeshareId?._id}/book/review-order/${paymentInfo._id}`,
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
        // Create PayPal payment asynchronously
        const payment = await new Promise((resolve, reject) => {
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });
        // Extract approval URL from payment links
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url')?.href;
        if (!approvalUrl) {
            throw new ApiError(StatusCodes.NO_CONTENT, 'Approval URL not found');
        }
        return approvalUrl;
    }

    async ExecutePayPalPayment(data) {
        const {sender, receiver, reservationId, timeshareId, payerID, paymentId, method, amount} = data;
        const reservation = await ReservationModel.findById(reservationId);
        const execute_payment_json = {
            "payer_id": payerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": amount.toString()
                }
            }]
        };
        const paymentSuccess = await new Promise((resolve, reject) => {
            paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
                if (error) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, `Paypal payment executed fail: ${error}`)
                } else {
                    resolve(payment);
                }
            });
        });
        if (paymentSuccess) {
            // Update reservation status to 'paid'
            await ReservationModel.updateOne({_id: reservationId}, {$set: {isPaid: true}});
            // Update timeshare status to 'not bookable'
            await TimeshareModel.updateOne({_id: timeshareId}, {$set: {is_bookable: false, renterId: sender}});
            // Create a new rental transaction
            const newRentalTransaction = new RentalTransactionModel({
                reservationId: reservationId,
                sender: sender,
                receiver: receiver,
                app_paymentId: paymentId,
                method: {
                    name: method
                },
                amount: amount,
                is_widthdraw: false,
                timestamp: new Date(),
            });
            await tripService.CreateTripByTimeshareId(reservation);
            return newRentalTransaction.save();
        }
    }

    async RefundPayment() {

    }

    async CreateVNPay(req, userId, servicePackId) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let config = require('../../configs/default.json');

        let tmnCode = "TG4G0CYV";
        let secretKey = "OIEUZLVYEHNDVYKFPDOAJXIMTWIDVKJT";
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        let returnUrl = `http://localhost:3000/payment/${userId}/vnpay_return`;

        let orderId = moment(date).format('DDHHmmss');
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;
        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }

        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = parseFloat(amount) * 100; // Convert amount to Number before multiplication
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, {encode: false});
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, {encode: false});

        try {
            const vnpayData = {
                orderId: orderId,
                userId: userId,
                app_paymentId: tmnCode,
                servicePackId: servicePackId,
                vnp_Locale: locale,
                vnp_CurrCode: currCode,
                vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
                amount: parseFloat(amount),
                vnp_CreateDate: createDate,
                vnp_BankCode: bankCode,
                method: {
                    name: "vnpay",
                },
                status: 'Pending',
            };

            const vnpay = new PaymentModel(vnpayData);
            await vnpay.save();
        } catch (error) {
            console.error(error);
        }
        return vnpUrl;
    }


    async VNPayReturn(req, res, next) {
        try {
            let vnp_Params = req.query;
            let secureHash = vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let config = require('../../configs/default.json');
            let secretKey = config.vnp_HashSecret;

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, {encode: false});
            let crypto = require("crypto");
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
            let responseData = {};

            if (secureHash === signed) {
                let responseData = {};
                if (vnp_Params['vnp_ResponseCode'] === '00') {
                    let payment = await PaymentModel.findOneAndUpdate({orderId: vnp_Params['vnp_TxnRef']}, {status: 'Success'});
                    // console.log(payment.userId)
                    const servicePack = await ServicePackModel.findOne({amount: payment.amount});
                    const user = await UserModel.findOneAndUpdate({_id: payment.userId}, {servicePack: servicePack._id});

                    responseData = {
                        success: true,
                        message: 'Payment successful',
                        code: vnp_Params['vnp_ResponseCode']
                    };
                } else if (vnp_Params['vnp_ResponseCode'] === '24') {
                    let payment = await PaymentModel.findOneAndUpdate({orderId: vnp_Params['vnp_TxnRef']}, {status: 'Failed'});
                    responseData = {
                        success: false,
                        message: 'Payment canceled by user',
                        code: vnp_Params['vnp_ResponseCode']
                    };
                }
                return responseData;
            } else {
                console.log("Secure hash mismatch");
                return {
                    success: false,
                    message: 'Secure hash mismatch',
                    code: '97'
                };
            }
        } catch (error) {
            console.error("Error occurred:", error);
            throw error;
        }
    }
    async GetTotalAmount() {
        try {
            const data = await PaymentModel.find({status: 'Success'}).select('amount status'); 
            let total = 0;
            data.forEach(payment => {
                if (payment.status === "Success") {
                    total += payment.amount;
                }
                console.log(payment)
            });
            return total;
        } catch (error) {
            throw error;
        }
    }

    async GetTotalServicePack() {
        try {
            const data = await PaymentModel.countDocuments({status: 'Success'}); 
            return data;
        } catch (error) {
            throw error;
        }
    }
    async CountAllUsers() {
        try {
            const data = await UserModel.countDocuments({role: "user"}); 
            return data;
        } catch (error) {
            throw error;
        }
    }
    
    

}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = new PaymentService;