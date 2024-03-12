const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
})