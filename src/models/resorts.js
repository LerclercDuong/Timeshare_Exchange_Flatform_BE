const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Units',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    facilities: [{
        type: String
    }],
    nearby_attractions: [{
        type: String
    }],
    policies: [{
        type: String
    }],
    image_urls: [{
        type: String
    }]
});

const Resort = mongoose.model('Resorts', resortSchema);

module.exports = Resort;
