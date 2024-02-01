const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users'); // Import the Users model
const mongooseDelete = require('mongoose-delete');
const paginate = require("./plugin/paginate");
const dateRange = require('./plugin/dateRange');

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    current_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    resort: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resorts',
        required: true,
    },
    image: {
        type: Array,
        path: String,
    },
    is_verified:{
        type: Boolean,
        default: false
    },
    availability: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

});

postSchema.pre('save', async function (next) {
    try {
        // Lấy thông tin của User dựa trên userId
        const user = await mongoose.model('Users').findById(this.current_owner);

        // Gán giá trị username từ thông tin User vào trường username của Properties
        if (user) {
            this.username = user.username;
        }

        next();
    } catch (error) {
        next(error);
    }
});

postSchema.plugin(paginate);
postSchema.plugin(dateRange);

postSchema.plugin(mongooseDelete,
    { deletedAt: true });

const Post = mongoose.model('Posts', postSchema);

module.exports = Post;

