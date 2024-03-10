const bcrypt = require('bcrypt');
const moment = require("moment");
const ExchangeModel = require("../../models/exchanges");
const TimeshareModel = require("../../models/timeshares");
const tripService = require("./trip.service");
const emailService = require('./email.service');
const tokenService = require('./token.service')
const ReservationModel = require('../../models/reservations')

class ExchangeService {
    async MakeExchange(timeshareId, myTimeshareId, type, userId, fullName, phone, email, amount, status, request_at, country,
        street,
        city,
        province,
        zipCode,) {
        try {
            const address = {country, street, city, province, zipCode}
            const exchangeData = {
                timeshareId: timeshareId,
                myTimeshareId: myTimeshareId,
                type: 'exchange',
                userId: userId,
                fullName: fullName,
                phone: phone,
                email: email,
                amount: amount,
                status: status,
                request_at:request_at,
                address,
            };
            const timeshare = await TimeshareModel.findById(timeshareId);
            
            const countExchange = await ExchangeModel.countDocuments({ timeshareId: timeshareId, type: 'exchange' });
            const countRent = await ReservationModel.countDocuments({ timeshareId: timeshareId, type: 'rent' });
            const count = countExchange + countRent
            const to = timeshare.current_owner.email;
    
            await emailService.SendRequestExchange(to, timeshare, count, countExchange, countRent);
    
            const exchange = await ExchangeModel({ ...exchangeData });
            return exchange.save().catch();
        } catch (error) {
            throw new Error('Error request');
        }
    }
  
    async ConfirmExchange(exchangeId) {
        try {
            const exchange = await ExchangeModel.findById(exchangeId);
            if (!exchange) {
                throw new Error('Reservation not found');
            }
    
            await ExchangeModel.updateOne(
                { _id: exchangeId },
                {
                    $set: {
                        status: 'Completed',
                        confirmed_at: new Date()
                    }
                }
            );
    
            // find information of timeshare and myTimeshare
            const timeshare = await TimeshareModel.findById(exchange.timeshareId);
            const myTimeshare = await TimeshareModel.findById(exchange.myTimeshareId);
                console.log(myTimeshare.owner_exchange)
                console.log(timeshare.owner_exchange)

            if (!timeshare || !myTimeshare) {
                throw new Error('Timeshare not found');
            }
    
            // exchange and close
            await TimeshareModel.updateOne(
                { _id: exchange.timeshareId },
                {
                    $set: {
                        owner_exchange: myTimeshare.owner_exchange,
                        is_bookable: false
                    }
                }
            );
    
            await TimeshareModel.updateOne(
                { _id: exchange.myTimeshareId },
                {
                    $set: {
                        owner_exchange: timeshare.owner_exchange,
                        is_bookable: false
                    }
                }
            );
    
            // create trip 
            await tripService.CreateTripByTimeshareId(exchange);
            await tripService.CreateTripByMyTimeshareId(exchange);
            

            // const count = await ReservationModel.countDocuments({ timeshareId: exchange.timeshareId });
            // const subject = 'You have' + {count} + 'notifications about at NiceTrip';
            // const text = `Thank you for your reservation at NiceTrip, please waiting for owner acceptance`;
            // await this.SendEmail(to, subject, text);

            const toOwnerMyTimeshare = exchange.email;
            const toOwnerTimeshare = exchange.timeshareId.current_owner.email;
            console.log(toOwnerTimeshare)
            console.log(toOwnerMyTimeshare)
            await emailService.NotificationExchangeSuccessToOwnerTimeshareId(toOwnerTimeshare, exchange);
            await emailService.NotificationExchangeSuccessToOwnerMyTimeshareId(toOwnerMyTimeshare, exchange);
    
            return {
                exchange_id: exchange.timeshareId,
                code: 200,
                confirmed_at: exchange.confirmed_at,
                message: 'Guest name confirmed'
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async GetExchangeRequestOfTimeshare(timeshareId){
        return ExchangeModel.find({timeshareId: timeshareId, type: 'exchange'});

    }

    async GetExchangeById(id) {
        return ExchangeModel.findById(id).lean();
    }

    async CancelExchange(exchangeId) {
        try {
            const exchange = await ExchangeModel.findById(exchangeId);
            if (!exchange) {
                throw new Error('Reservation not found');
            }
    
            await ExchangeModel.updateOne(
                { _id: exchangeId },
                {
                    $set: {
                        status: 'Canceled',
                        confirmed_at: new Date()
                    }
                }
            );
          
            const toOwnerMyTimeshare = exchange.email;
            console.log(toOwnerMyTimeshare)
            await emailService.NotificationExchangeCancelToOwnerMyTimeshareId(toOwnerMyTimeshare, exchange);
    
            return {
                exchange_id: exchange.timeshareId,
                code: 200,
                confirmed_at: exchange.confirmed_at,
                message: 'Guest name confirmed'
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

async function checkAndUpdateExchangesStatus() {
    const exchanges = await ExchangeModel.find({ status: { $in: ['Agreement phase'] } });
    console.log(exchanges);
    exchanges.forEach(async (exchange) => {
        const lastUpdatedTime = exchange.request_at;
        const currentTime = new Date();
        const timeDiffInHours   = Math.abs(currentTime - lastUpdatedTime) / 36e5;
        console.log(lastUpdatedTime);
        if (timeDiffInHours >= 48) {
            await ExchangeModel.findByIdAndUpdate({ _id: exchange._id }, { status: 'Expired' });
        }
    });
}

setInterval(checkAndUpdateExchangesStatus, 24 * 60 * 60 * 1000);

module.exports = new ExchangeService;
