const UserModel = require('../../models/users');
const RequestModel = require('../../models/requests');
const PaymentModel = require('../../models/payments');
const ReservationModel = require('../../models/reservations')
const ConversationModel = require('../../models/conversations')
const MessageModel = require('../../models/messages')
const {StatusCodes} = require('http-status-codes')
const query = require('../../utils/query')

class ChatService {
    async CreateConversation(ownerId, reservationId) {
        const reservation = await ReservationModel.findById(reservationId);
        const existingConversation = await ConversationModel.findOne({
            reservationId,
            participants: { $all: [ownerId, reservation.userId] } // Check if a conversation already exists with the same participants
        });

        if (existingConversation) {
            // If a conversation already exists, you can handle this situation accordingly
            throw new Error("Conversation already exists for these participants in the same reservation");
        }

        if (!reservation) {
            throw new Error("Reservation not found");
        }

        return await ConversationModel.create({
            reservationId,
            participants: [ownerId, reservation.userId],
            messages: [], // Initially, the conversation starts with no messages
        });
    }

    async GetConversationOfUser(userId) {
        return ConversationModel.find({
            participants: userId,
        })
    }
    async GetConversationById(conversationId) {
        return ConversationModel.findById(conversationId);
    }
    async SaveMessage({ conversationId, sender, content, images, timestamp }) {
        const newMessage = new MessageModel({
            conversationId,
            sender,
            content,
            images,
            timestamp
        });
        // Save the message to the database
        const savedMessage = await newMessage.save();
        // Update the conversation with the new message
        const updatedConversation = await ConversationModel.findOneAndUpdate(
            { _id: conversationId },
            { $push: { messages: savedMessage._id } },
            { new: true }
        );
        return savedMessage;
    }
}

module.exports = new ChatService;
