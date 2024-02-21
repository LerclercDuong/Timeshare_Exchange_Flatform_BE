const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users'); // Import the Users model
const mongooseDelete = require('mongoose-delete');
const {GetPresignedUrl, uploadToS3} = require("../utils/s3Store");
const paginate = require("./plugin/paginate");

const postSchema = new Schema({
    postId: {
        type: String,
        // required: true
    },
    type: {
        type: String,
        enum: ['rental', 'exchange'],
        required:true
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    current_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    resortId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resorts',
        required: true,
    },
    unitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Units',
        required: true,
    },
    numberOfNights: {
        type: Number,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    pricePerNight: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        path: String
    },
    is_bookable: {
        type: Boolean,
        default: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});
postSchema.plugin(paginate);
postSchema.pre('save', async function (next) {
    try {
        // Lấy thông tin của User dựa trên userId
        const user = await mongoose.model('Users').findById(this.current_owner);
        // if (!this.postId) {
        //     const latestPost = await mongoose.model('Posts').findOne({}, {}, { sort: { 'timestamp': -1 } });
        //     const latestPostNumber = latestPost ? parseInt(latestPost.postId.slice(1)) : 0;
        //     this.postId = 'P' + (latestPostNumber + 1).toString().padStart(6, '0');
        // }
        // Gán giá trị username từ thông tin User vào trường username của Properties
        if (user) {
            this.username = user.username;
        }

        next();
    } catch (error) {
        next(error);
    }
});

postSchema.plugin(mongooseDelete,
    {deletedAt: true});
postSchema.pre('find', async function (docs, next) {
    this.populate({
        path: "resortId current_owner unitId"
    })
});
postSchema.pre('findOne', async function (docs, next) {
    this.populate({
        path: "resortId current_owner unitId"
    })
});

postSchema.post('find', async function (docs, next) {
    for (let doc of docs) {
        if (doc.images) doc.images = await Promise.all(doc.images.map(GetPresignedUrl));
    }
    next()
});
postSchema.post('findOne', async function (doc, next) {
    if (doc.images) doc.images = await Promise.all(doc.images.map(GetPresignedUrl));
    next()
});

const Post = mongoose.model('Posts', postSchema);


module.exports = Post;

