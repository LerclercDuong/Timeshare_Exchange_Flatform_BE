const mongoose = require('mongoose');
const paginate = require("./plugin/paginate");

const resortSchema = new mongoose.Schema({
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
    }],
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Units' }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviews',
    }],
});

resortSchema.plugin(paginate);

const Resort = mongoose.model('Resorts', resortSchema);

module.exports = Resort;
