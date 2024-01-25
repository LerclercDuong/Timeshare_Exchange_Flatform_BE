const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../api/user');
const PropertyModel = require("../models/properties");
const { mutipleMongooseToObject }= require('../utils/mongoose')

class PropertyService {

    PropertyPostTimeshare(res, req, next){
        return PropertyModel.find({})
        .catch(next);
    }
    PostProperty = async(nameProperty, location) => {
        const postData = {
            nameProperty: nameProperty,
            location: location,
        }
        const newData = new PropertyModel({...postData});
        return newData.save().catch();
    }

    // stored(req, res, next){
    //     Property.find({})
    //         .then(properties => res.render('timeshare/test.hbs', {
    //             properties: mutipleMongooseToObject (properties) // dùng để gọi nhiều object
            
    //         }))
    //         .catch(next);
    //     }
    // Upload = async (name) => {
    //     // Add any additional processing logic here
    //     const uploadData = {
    //         name: name,
    //     }
    //     const newUpload = new TimeshareModel({...uploadData});
    //     return newUpload.save().catch();
    // }

}

module.exports = new PropertyService;