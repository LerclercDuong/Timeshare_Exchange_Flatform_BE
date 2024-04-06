const { chatServices } = require('../services/v2')

/**
 * Initialize the Socket.IO server.
 * @param {object} io - The Socket.IO server instance.
 */
function socketIO(io) {

    const typingUsers = new Set(); // Set to store typing users
    const onlineUsers = new Set(); // Set to store online users

    /**
     * Converts a JavaScript object to a JSON string.
     * @param {object} obj - The object to be serialized.
     * @returns {string} - The JSON representation of the object.
     */
    function serializeObject(obj) {
        return JSON.stringify(obj);
    }

    // Handle 'connection' event when a client connects
    io.on("connection", (socket) => {
        console.log('user join', socket.id)
        // Handle 'join' event
        socket.on("join", (data) => {
            socket.join(data);
        })
        // Handle 'un-join' event
        socket.on("un-join", (data) => {
            socket.leave(data);
        })
        // Handle 'message' event
        socket.on('send-message', async (data) => {
            console.log(data);
            await chatServices.SaveMessage(data);
            socket.to(data.conversationId).emit('ping-message', data);
            // if (handleSuccess) {
            //     socket.emit("pingMessage", pingMessage);
            //     socket.to(data.roomId).emit("pingMessage", pingMessage);
            // }
            //
            // if (data.content.startsWith('/gpt')) {
            //     const question = data.content.slice(3);
            //     const answer = await gptServices.generateAnswer(question)
            //
            //     let cleanedAnswer = answer.replace(/[{}" ]/g, ' ').trim();
            //
            //     const chatBotData = await userServices.GetUserByName('GPTChatbot');
            //     const gptMessage = {
            //         messagePacket: {
            //             sender: "GPTChatbot",
            //             senderData: {
            //                 profilePicture: "https://pnghive.com/core/images/full/chat-gpt-logo-png-1680406057.png"
            //             },
            //             images: [],
            //             roomId: data.roomId,
            //             content: cleanedAnswer,
            //             timestamp: new Date()
            //         }
            //     }
            //     const saveMessage = {
            //         messagePacket: {
            //             sender: "GPTChatbot",
            //             senderData: chatBotData._id,
            //             images: [],
            //             roomId: data.roomId,
            //             content: cleanedAnswer,
            //             timestamp: new Date()
            //         }
            //     }
            //     const gptResponse = await messengerServices.SaveMessageToDB(saveMessage.messagePacket)
            //     console.log(gptResponse)
            //
            //     socket.emit("pingMessage", gptMessage.messagePacket);
            //     socket.to(data.roomId).emit("pingMessage", gptMessage.messagePacket);
            // }
        })

        // Handle 'isTyping' event
        socket.on("isTyping", (data) => {
            const {username, roomId} = data;
            if (username && roomId) {
                typingUsers.add(serializeObject(data));
                const typingUserArray = Array.from(typingUsers).map((jsonString) => JSON.parse(jsonString));
                socket.to(roomId).emit("pingIsTyping", typingUserArray);
            }
        })

        // Handle 'isNotTyping' event
        socket.on("isNotTyping", (data) => {
            const {username, roomId} = data;
            if (username && roomId) {
                typingUsers.delete(serializeObject(data));
                const typingUserArray = Array.from(typingUsers).map((jsonString) => JSON.parse(jsonString));
                socket.to(roomId).emit("pingIsTyping", typingUserArray);
            }
        })

        // Handle 'disconnect' event when a client disconnects
        socket.on('disconnect', function () {
            const socketId = socket.id;
            for (const obj of onlineUsers) {
                if (obj.socketId === socketId) {
                    onlineUsers.delete(obj);
                    break; // Exit the loop after the object is deleted
                }
            }
            console.log(onlineUsers)
            const onlineUsersArray = Array.from(onlineUsers).map((e) => e);
            io.sockets.emit("pingOnlineState", onlineUsersArray);
        });
    })
}

module.exports = socketIO;
