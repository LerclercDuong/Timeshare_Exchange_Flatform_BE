const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {GetPresignedUrl} = require("../utils/s3Store");
const { isValidURL } = require('../utils/url');

const unitSchema = new Schema({
    name: {type: String, required: true},
    roomType: {type: String, required: true},
    kitchenType: {type: String, required: true},
    sleeps: {type: Number, required: true},
    bathrooms: {type: Number, required: true},
    image: {
        type: String,
        required: true,
    },
    features: {
        type: Array,
        path: String,
        required: true,
    },
    resort: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resorts',
        required: true,
    }
});

unitSchema.post('findOne', async function (doc, next) {
    if (doc && doc.image && isValidURL(doc.image)) doc.image = await GetPresignedUrl(doc.image);
    next()
});
unitSchema.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc && doc.image && !isValidURL(doc.image)) doc.image = await GetPresignedUrl(doc.image);
    }
    next()
});

const Unit = mongoose.model('Units', unitSchema);

module.exports = Unit;