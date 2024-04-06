const mongoose = require('mongoose');
const paginate = require("./plugin/paginate");
const {GetPresignedUrl} = require("../utils/s3Store");
const {isValidURL} = require("../utils/url");

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
});

resortSchema.plugin(paginate);

resortSchema.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc && doc.image_urls) {
            doc.image_urls.forEach(async (image, index) => {
                if (!isValidURL(image)) {
                    doc.image_urls[index] = await GetPresignedUrl(image);
                }
            })
        }
    }
    next()
});
resortSchema.post('findOne', async function (doc, next) {
    if (doc && doc.image_urls) {
        doc.image_urls.forEach(async (image, index) => {
            if (!isValidURL(image)) {
                doc.image_urls[index] = await GetPresignedUrl(image);
            }
        })
    }
    next()
});

const Resort = mongoose.model('Resorts', resortSchema);

module.exports = Resort;
