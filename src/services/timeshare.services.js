const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../api/user');
const TimeshareModel = require("../models/timeshares");
const properties = require('../models/properties');

class TimeshareService {

    async GetAllTimeshare(){
        return TimeshareModel.find({}).select('_id name start_date image end_date location price deletedAt').lean();
    }
    async GetTimeShareByTrash(){
        return TimeshareModel.find({deleted: true}).populate({
            path: 'deleted',
            select: '_id name start_date end_date current_owner location price deletedAt'
        })
        .select('_id name start_date end_date current_owner location price deletedAt')
        .lean();
    }

    async GetTimeshareByCurrentOwner(current_owner) {
        return TimeshareModel
            .find({current_owner})
            .populate({
                path: 'current_owner',
                select: '_id username profilePicture role'
            })
            .select('_id name start_date end_date current_owner location price')
            .lean();
    }


   

    async DeleteTimeshare(req) {
        const deleteTimeshare = await TimeshareModel.delete({_id: req.params.id}, req.body)
        return deleteTimeshare;
    } // thu vien mongoose soft-delete
    async UpdateTimeshare(req) {
        const updateTimeshare = await TimeshareModel.updateOne({_id: req.params.id}, req.body)
        return updateTimeshare;
    } // thu vien mongoose soft-delete
    async RestoreTimeshare(req) {
        const restoreTimeshare = await TimeshareModel.restore({_id: req.params.id}, req.body)
        return restoreTimeshare;
    } // thu vien mongoose soft-delete
    async ForceDeleteTimeshare(req) {
        const forceDeleteTimeshare = await TimeshareModel.deleteOne({_id: req.params.id}, req.body)
        return forceDeleteTimeshare;
    }

    // services.js
    //  async PostTimeshare(name, start_date, end_date, current_owner, location, price) {
    //     const nameExists = await TimeshareModel.findOne({name: name});
    //     if (nameExists) throw new Error("Name is exist")
    //     const timeshareData = {
    //         name: name,
    //         start_date: start_date,
    //         end_date: end_date,
    //         current_owner: current_owner,
    //         location: location,
    //         price: price,
    //     }
    //     const newTimeshare = new TimeshareModel({...timeshareData});
    //     return newTimeshare.save().catch();
    // }

    // Assuming you have imported the necessary modules and TimeshareModel

Upload = async (req, name, nameProperty, price, start_date, end_date, images) => {
    try {
        // Get the selected nameProperty from the form data
        const nameProperty = req.body.nameProperty;

        // Add any additional processing logic here
        const uploadData = {
            image: images,
            name: name,
            nameProperty: nameProperty,
            price: price,
            start_date: start_date,
            end_date: end_date,
        }

        const newUpload = new TimeshareModel({ ...uploadData });
        return newUpload.save();
    } catch (error) {
        throw error; // Handle the error appropriately, log or return as needed
    }
}


    // Upload = async (req, name, price, start_date, end_date, image) => {
    //     // Add any additional processing logic here
    //     const uploadData = {
    //       image: image,
    //       name: name,
    //       price: price,
    //       start_date: start_date,
    //       end_date: end_date,
    //     };
      
    //     const newUpload = new TimeshareModel({ ...uploadData });
    //     return newUpload.save().catch();
    //   };
//     Upload = async (req) => {
//     try {
//         // Process the uploaded file
//         const uploadedFileInfo = req.file;
//         // const uploadData = {
//         //     ten: ten,}
//         // Add any additional processing logic here
//         return uploadedFileInfo;
        
//     } 
//     catch (error) {
//         throw error;
//     }
//     const newTimeshare = new TimeshareModel({...uploadData});
//     return newTimeshare.save().catch();

// };


}

module.exports = new TimeshareService;