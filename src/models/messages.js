const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: false
    },
    timestamp: {
        type: Date,
    }
});

messageSchema.pre('find', function(next) {
    this.populate({
        path: "sender"
    })
    next();
});
// messageSchema.pre('save', function (next) {
//     this.timestamp = new Date(this.timestamp.getTime() + 7 * 60 * 60 * 1000); // Adjust for GMT+7
//     next();
// });

module.exports = mongoose.model('Messages', messageSchema);