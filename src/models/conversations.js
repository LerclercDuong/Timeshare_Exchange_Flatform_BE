const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservations',
        required: true,
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Messages'
        }
    ],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

conversationSchema.pre('find', function(next) {
    this.populate({
        path: "participants messages"
    })
    next();
});
conversationSchema.pre('findOne', function(next) {
    this.populate({
        path: "participants messages"
    })
    next();
});
conversationSchema.path('participants').validate(function (value) {
    // Use a Set to store unique participant IDs
    const uniqueParticipants = new Set(value.map(String));

    // Check if the Set's size is the same as the original array's length
    return uniqueParticipants.size === value.length;
}, 'Duplicate participants are not allowed.');

module.exports = mongoose.model('Conversations', conversationSchema);

