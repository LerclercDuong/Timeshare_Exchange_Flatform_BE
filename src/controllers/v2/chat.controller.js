const axios = require('axios')
const {chatServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');

class ChatController {
    async GetConversationById(req, res, next){
        try {
            const conversationId = req.params.conversationId;
            const conversation = await chatServices.GetConversationById(conversationId)
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Conversation found'
                },
                data: conversation
            })
        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Create conversation fail'
                },
                data: null
            })
        }
    }
    async CreateConversation(req, res, next) {
        try {
            const {ownerId, reservationId} = req.body;
            const newConversation = await chatServices.CreateConversation(ownerId, reservationId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'New conversation created'
                },
                data: newConversation
            })
        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Create conversation fail'
                },
                data: null
            })
        }
    }
    

    async CreateConversationExchange(req, res, next) {
        try {
            const {ownerId, exchangeId} = req.body;
            const newConversation = await chatServices.CreateConversationExchange(ownerId, exchangeId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'New conversation created'
                },
                data: newConversation
            })
        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Create conversation fail'
                },
                data: null
            })
        }
    }
    async GetConversationOfUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const conversations = await chatServices.GetConversationOfUser(userId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'New conversation created'
                },
                data: conversations
            })
        } catch (e) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: {
                    code: res.statusCode,
                    message: 'Create conversation fail'
                },
                data: null
            })
        }
    }
}

module.exports = new ChatController;