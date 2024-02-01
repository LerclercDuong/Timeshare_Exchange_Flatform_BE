const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const unitSchema = new Schema({
    name: {
        type: String,
    },

    details: {
        type: String,
    },

    img: [{
        type: String
    }]
});
unitSchema.plugin(mongooseDelete);
const Unit = mongoose.model('Units', unitSchema);

module.exports = Unit;
