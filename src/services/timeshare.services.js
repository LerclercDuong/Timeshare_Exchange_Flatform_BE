const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../api/user');
const TimeshareModel = require("../models/timeshares");

class TimeshareService {

    // //signup function
    // async SignUp(username, password) {
    //     const userExists = await UserModel.findOne({username: username});
    //     if (userExists) throw new Error("User is exist")
    //     const userData = {
    //         username: username,
    //         password: password,
    //         role: 'user',
    //     }
    //     const newUser = new UserModel({...userData});
    //     return newUser.save().catch();
    // }
    async GetTimeshare(){
        return TimeshareModel.findById().select('_id name start_date end_date current_owner username location price').lean();
    }

    async GetTimesharerByCurrentOwner(current_owner){
        return TimeshareModel.find({current_owner}).select('_id name start_date end_date current_owner username location price').lean();
    }



    async PostTimeshare(name, start_date, end_date,current_owner, username, location, price) {
        const nameExists = await TimeshareModel.findOne({name: name});
        if (nameExists) throw new Error("Name is exist")
        const timeshareData = {
            name: name,
            start_date: start_date,
            end_date: end_date,
            current_owner: current_owner,
            username: username,
            location: location,
            price: price,
        }
        const newTimeshare = new TimeshareModel({...timeshareData});
        return newTimeshare.save().catch();
    }
}

module.exports = new TimeshareService;