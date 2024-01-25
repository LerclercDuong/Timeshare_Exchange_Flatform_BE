const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users'); // Import the Users model
const properties = new Schema({
  nameProperty: { 
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  }
});



// sử dụng thư viện soft delete và overrideMethods (hide or show)
module.exports = mongoose.model('Properties', properties);

