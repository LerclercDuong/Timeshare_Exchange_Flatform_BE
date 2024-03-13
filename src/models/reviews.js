const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    resortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resorts',
        required: true,
    },
    star: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
})

reviewSchema.pre('save', async function (next) {
    try {
        next();
    }
    catch (error) {
        next(error);
    }
})

const Review = mongoose.model('Reviews', reviewSchema);
module.exports = Review;