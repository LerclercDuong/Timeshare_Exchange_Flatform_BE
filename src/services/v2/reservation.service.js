const bcrypt = require('bcrypt');
const moment = require("moment");
const ReservationModel = require("../../models/reservations");
const TimeshareModel = require("../../models/timeshares");
const RequestModel = require("../../models/requests");
const PostModel = require("../../models/posts")
const tripService = require("./trip.service");
class ReservationService {
    async GetReservationOfUser(userId) {
        return await ReservationModel.find({userId: userId, isPaid: true})
    }
    async GetReservationOfPost(postId) {
        return await ReservationModel.find({postId: postId, isPaid: true})
    }
    async GetReservationById(id) {
        return await ReservationModel.findById(id).lean();
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
    async ConfirmReservation(reservationId){
        const reservation = await ReservationModel.findById(reservationId);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        await ReservationModel.updateOne(
            { _id: reservationId },
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
            { _id: reservation.postId._id },
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

}

module.exports = new ReservationService;
