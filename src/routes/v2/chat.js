const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/v2/chat.controller');

router.post('/create', chatController.CreateConversation);
router.post('/create/exchange', chatController.CreateConversationExchange);
router.get('/conversation-of-user/:userId', chatController.GetConversationOfUser);
router.get('/conversation/:conversationId', chatController.GetConversationById);

module.exports = router;