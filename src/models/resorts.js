const mongoose = require('mongoose');
const {resortServices} = require("../services/v2");
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
    room_type: [{
        type: Object
    }]
});

resortSchema.plugin(paginate);

const Resort = mongoose.model('Resorts', resortSchema);

module.exports = Resort;
