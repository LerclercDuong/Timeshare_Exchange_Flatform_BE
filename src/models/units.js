const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
    name: {type: String, required: true},
    details: {type: String, required: true},
    image_urls: {
        type: Array,
        path: String
    },
    resort: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resorts',
        required: true,
    }
});

const Unit = mongoose.model('Units', unitSchema);

module.exports = Unit;