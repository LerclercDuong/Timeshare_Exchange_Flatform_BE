const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");
const tripService = require("./trip.service");
const tokenServices = require("./token.service");

class ReservationService {
    async GetReservationOfUser(userId) {
        return await ReservationModel.find({userId: userId})
    }

    async GetReservationOfPost(postId) {
        return await ReservationModel.find({postId: postId, isPaid: true})
    }

    async GetReservationById(id) {
        return await ReservationModel.findById(id).lean();
    }

    async ConfirmReservationByEmail(reservationId, token) {
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
        const post = await PostModel.findById(reservation.postId);
        if (!post) {
            throw new Error('Post not found');
        }
        await PostModel.updateOne(
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

    async MakeReservation(data) {
        const {
            userId, postId, reservationDate, fullName, phone, email, country,
            street,
            city,
            province,
            zipCode, amount
        } = data;
        const address = {country, street, city, province, zipCode}
        // Create a new reservation instance
        const newReservation = new ReservationModel({
            userId,
            postId,
            reservationDate,
            fullName,
            phone,
            email,
            address,
            amount,
            isPaid: false,
            status: 'pending',
        });
        return await newReservation.save().catch();
    }

    async ConfirmReservation(reservationId) {
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

    async ConfirmReservation(reservationId) {
        try {
            const reservation = await ReservationModel.findById(reservationId);
            if (!reservation) {
                throw new Error('Reservation not found');
            }
            reservation.is_confirmed = true;
            await reservation.save();
            return reservation;
        } catch (error) {
            throw new Error('Error confirming reservation');
        }
    }

    async ConfirmReservationByToken(reservationId, token) {
        const tokenData = await tokenServices.VerifyConfirmReservationToken(token);
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
}

module.exports = new ReservationService;
