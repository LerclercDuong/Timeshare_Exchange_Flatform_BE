const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: true,
      },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending',
    },
    type: {
        type: String,
        required: true,
        enum: ['rent', 'exchange'],
        default: 'rent',
    },
});

const Request = mongoose.model('Requests', requestSchema);

module.exports = Request;
