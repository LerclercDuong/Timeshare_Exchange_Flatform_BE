const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");
const tripService = require("./trip.service");
const emailService = require('./email.service');
const tokenService = require('./token.service')
const TransactionModel = require("../../models/transaction");

class ReservationService {
    async GetReservationOfUser(userId) {
        return ReservationModel.find({userId: userId});
    }

    async GetReservationOfPost(timeshareId, type) {
        return ReservationModel.find({timeshareId: timeshareId, type: type,}).sort({ createdAt: -1 });;
    }

    async GetReservationById(id) {
        return ReservationModel.findById(id).lean();
    }

    async GetRentRequestOfTimeshare(timeshareId) {
        return ReservationModel.find({timeshareId: timeshareId, type: 'rent'});
    }

    async MakeReservation(type, data) {
        try{
            const {
                userId, timeshareId, reservationDate, fullName, phone, email, country,
                street,
                city,
                province,
                zipCode, amount
            } = data;
            const address = {country, street, city, province, zipCode}
            const existingReservation = await ReservationModel.findOne({
                userId,
                timeshareId,
                status: { $ne: "Canceled" }
            });

            if (existingReservation) {
                throw new Error('You have reserved this timeshare before. Go to My Orders to check it.');
            }
            // Create a new reservation instance
            const newReservation = new ReservationModel({
                userId,
                timeshareId,
                reservationDate,
                fullName,
                phone,
                email,
                address,
                amount,
                type: type,
                isPaid: false,
            });
            return await newReservation.save();
        }catch(err){
            throw err
        }
    }

    async AcceptReservationByOwner(reservationId) {
        const reservation = await ReservationModel.findById(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return ReservationModel.updateOne(
            {_id: reservationId},
            {
                $set: {
                    is_accepted_by_owner: true,
                },
            }
        );
    }

    async DenyReservationByOwner(reservationId) {
        const reservation = await ReservationModel.findById(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        // Check if the reservation is in a state where it can be denied (e.g., in 'Agreement phase')
        if (reservation.status !== 'Agreement phase' || reservation.is_accepted_by_owner) {
            // Handle the case where the reservation cannot be denied
            throw new Error('Invalid reservation state for denial');
        }
        // Update reservation fields using updateOne
        return ReservationModel.updateOne(
            {_id: reservationId},
            {
                $set: {
                    is_denied_by_owner: true,
                    status: 'Canceled',
                    denied_at: new Date(),
                },
            }
        );
    }

    async AcceptReservationOld(reservationId) {
        const reservation = await ReservationModel.findById(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        await ReservationModel.updateOne(
            {_id: reservationId},
            {
                $set: {
                    status: 'confirmed',
                    confirmed_at: new Date()
                }
            }
        );
        const post = await TimeshareModel.findById(reservation.postId);
        if (!post) {
            throw new Error('Post not found');
        }
        await TimeshareModel.updateOne(
            {_id: reservation.postId._id},
            {
                $set: {
                    is_bookable: false
                }
            }
        );
        await tripService.CreateTrip(reservation);
        return {
            reservation_id: reservation.postId,
            code: 200,
            confirmed_at: reservation.confirmed_at,
            message: 'Guest name confirmed'
        };
    }

    async ConfirmRent(reservationId) {
        try {
            const reservation = await ReservationModel.findById(reservationId);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            reservation.status = 'confirmed';
            await reservation.save();

            return reservation;
        } catch (error) {
            throw new Error('Error confirming reservation');
        }
    }

    async ConfirmReservationByToken(reservationId, token) {
        const tokenData = await tokenService.VerifyConfirmReservationToken(token);
        if (tokenData) {
            console.log(tokenData)
            const reservation = await ReservationModel.findById(reservationId);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            reservation.is_confirmed = true;
            await reservation.save();
            return reservation;
        } else {
            throw new Error('Token invalid')
        }
    }
    async CancelMyRentalRequest(reservationId) {
        try {
            const existingRental = await ReservationModel.findOne({ _id: reservationId });
            if (existingRental.timeshareId.isPaid) {
                return false; 
            }
            if (!existingRental) {
                throw new Error('Rental not exists');
            }
    
            if (existingRental.deleted) {
                return false; 
            }
            const caneledRental = await ReservationModel.updateOne(
                { _id: reservationId },
                {
                    $set: {
                        status: 'Canceled',
                        is_canceled_by_renter: true,
                        confirmed_at: new Date(),
                    }
                }
            );
            return caneledRental;
        } catch (error) {
            throw new Error('Error: ' + error.message);
        }
    }
    
    async DeleteMyRentalRequest(reservationId) {
        const deleteRental = await ReservationModel.delete({_id: reservationId})
        return deleteRental;
    }

}


module.exports = new ReservationService;
