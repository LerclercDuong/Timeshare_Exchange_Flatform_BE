const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('./users'); 
const Properties = require('./properties'); 

const mongooseDelete = require('mongoose-delete');
const timeshares = new Schema({
  image: {
    type: Array,
    path: String,
  },

  nameProperty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Properties',
    required: true,
},
  
  name: { 
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

  // location: { 
  //   type: String, 
  //   required: true,
  // },
  //   current_owner:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Users',
  //   required: true,
  // },

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
      // Assuming you want to populate the nameProperty with its corresponding document
      const property = await Properties.findById(this.nameProperty);
      if (property) {
          this.location = property.location; // Assuming you want to copy the location from the property
      }

      next();
  } catch (error) {
      next(error);
  }
});

timeshares.plugin(mongooseDelete,
  { deletedAt : true });
// sử dụng thư viện soft delete và overrideMethods (hide or show)
module.exports = mongoose.model('Timeshares', timeshares);

