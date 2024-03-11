const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.MONGO_DB_LOCAL, {})
        .then(function () {
            console.log('MongoDB Connected');
        })
        .catch(function (err) {
            console.log('MongoDB connection fail');
            console.log(err)
        })
}

module.exports = {connect};