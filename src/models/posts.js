const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users'); // Import the Users model
const mongooseDelete = require('mongoose-delete');

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
    availability: {
        type: Boolean,
        default: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

});

timeshares.pre('save', async function (next) {
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

timeshares.plugin(mongooseDelete,
    { deletedAt: true });

const Post = mongoose.model('Timeshares', timeshares);

module.exports = Post;

