const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const users = new Schema({
    username: {
        type: String,
        required: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        unique: 1,
    },
    profilePicture: {
        type: String,
        required: true,
        default: 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

users.pre('save', async function (next) {

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/;

    const emailRegex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';

    const user = await this.constructor.findOne({username: this.username});

    if (user) throw new Error('A user is already registered with this username');

    if (this.email && !emailRegex.test(this.email)) throw new Error('Email must follow condition')

    if (!passwordRegex.test(this.password)) throw new Error('password must follow condition')

    //just hash password when modified password (change password, create new user)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // Generate a salt and hash the password
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Users', users);