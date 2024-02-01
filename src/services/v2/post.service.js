const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const PostModel = require("../../models/posts");
const ReservationModel = require('../../models/reservations');
const RequestModel = require('../../models/requests')

class PostService {

    // async GetTimeshare() {
    //     return TimeshareModel
    //         .find()
    //         .populate({
    //             path: 'current_owner',
    //             select: '_id name start_date end_date current_owner location price'
    //         })
    //         .select('_id name start_date end_date current_owner location price')
    //         .lean();
    // }
    async GetAllTimeshare(){
        return PostModel.find({}).select('_id price start_date end_date image current_owner resortId unitId availability').lean();
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
    async GetTimeshareById(id) {
        const getTimeshareById = await PostModel.findById(id)
        return getTimeshareById;
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

    Upload = async (req, resortId, unitId, current_owner, price, start_date, end_date, images) => {
        // Add any additional processing logic here
        const uploadData = {
            resortId: resortId,
            unitId: unitId,
            image: images,
            current_owner: current_owner,
            price: price,           
            start_date: start_date,
            end_date: end_date,
        }
        const newUpload = new PostModel({...uploadData});
        return newUpload.save().catch();
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

    async SubmitRentRequest(name, phone, userId, postId, requestId, status) {
        try {
            const submitData = {
                name: name,
                phone: phone,
                postId: postId,
                userId: userId,
                requestId: requestId,
                status: status,
            };
            const submitRent = new ReservationModel({ ...submitData });
            await submitRent.save();

            await PostModel.findByIdAndUpdate(postId, { availability: false });
            await RequestModel.findByIdAndUpdate(requestId, { status: 'confirmed' });

            return submitRent;
        } catch (error) {
            throw new ApiError('Error processing rent request', 500); // Handle error appropriately
        }
    }

}

module.exports = new PostService;