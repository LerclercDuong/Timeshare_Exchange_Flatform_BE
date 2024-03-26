const bcrypt = require('bcrypt');
const moment = require("moment");
const TimeshareModel = require("../../models/timeshares");
const ReservationModel = require('../../models/reservations');
const RequestModel = require('../../models/requests')
const nodemailer = require("nodemailer");
const {uploadToS3} = require("../../utils/s3Store");
const ResortModel = require("../../models/resorts");
const ExchangeModel = require('../../models/exchanges.js');
const ApiError = require('../../utils/ApiError');
const appPassword = 'zvpg rhqd qcfg tszn';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "bwfnguyenvu@gmail.com",
        pass: appPassword,
    },
});

class TimeshareService {
    async UpdateTimeshare(timeshareId, imageFiles, data) {
        // Check if the timeshare is bookable
        const timeshare = await TimeshareModel.findById(timeshareId);
        if (!timeshare) {
            throw new ApiError(404, 'Timeshare not found');
        }
        if (!timeshare.is_bookable) {
            throw new ApiError(400, 'Timeshare is not bookable and cannot be updated');
        }
        // Check if there are reservations with status not "canceled"
        const reservations = await ReservationModel.find({ timeshareId, status: { $ne: 'Canceled' } });
        if (reservations.length > 0) {
            throw new ApiError(400, 'There are active reservations for this timeshare, cannot update');
        }
        // Check if there are exchanges with status not "canceled"
        const exchanges = await ExchangeModel.find({ timeshareId, status: { $ne: 'Canceled' } });
        if (exchanges.length > 0) {
            throw new ApiError(400, 'There are active exchanges for this timeshare, cannot update');
        }
        // Update the timeshare
        try {
            const {current_owner} = data;
            const imageKeys = [];
            //Get existing image of timeshare
            if(data.imageFiles){
                if (!Array.isArray(data.imageFiles)) {
                    const urlWithoutQueryParams = (data.imageFiles).split('?')[0]; // Remove query parameters
                    const urlParts = urlWithoutQueryParams.split('/'); // Split the URL by '/'
                    const keyPart = urlParts.slice(3).join('/'); // Join parts starting from index 3
                    console.log(keyPart)
                    imageKeys.push(keyPart);
                } else {
                    for (const imageFile of data.imageFiles) {
                        const urlWithoutQueryParams = imageFile.split('?')[0]; // Remove query parameters
                        const urlParts = urlWithoutQueryParams.split('/'); // Split the URL by '/'
                        const keyPart = urlParts.slice(3).join('/'); // Join parts starting from index 3
                        console.log(keyPart)
                        imageKeys.push(keyPart);
                    }
                }
            }
            //additional image when update
            if(imageFiles){
                if (!Array.isArray(imageFiles)) {
                    const {key} = await uploadToS3({file: imageFiles, userId: current_owner});
                    imageKeys.push(key);
                } else {
                    for (const imageFile of imageFiles) {
                        const {key} = await uploadToS3({file: imageFile, userId: current_owner});
                        imageKeys.push(key);
                    }
                }
            }

            return await TimeshareModel.updateOne({ _id: timeshareId }, { $set: { ...data, images: imageKeys } });
        } catch (error) {
            throw new ApiError(500, 'Failed to update timeshare');
        }
    }

    async GetPosts(query, filter) {
        try {
            const { page = 1, limit = 8, search = "", sort = "price", type = "", start_date = "", end_date = "" } = query;
    
            const typeOptions = [
                "rental",
                "exchange",
            ];
    
            let types = [...typeOptions]; 
            if (type !== "") { 
                types = type.split(",");
            }
    
            let sortBy = {};
            const sortArray = sort.split(",");
            sortBy[sortArray[0]] = sortArray[1] || "asc";
    
            const queryFilters = { 
                type: { $in: types },
                ...(search !== "" && {
                    resortId: { 
                        $in: (await ResortModel.find({ "name": { $regex: search, $options: "i" } }))
                    }
                }),
                ...(start_date && { start_date: { $gte: start_date } }), 
                ...(end_date && { end_date: { $lte: end_date } }),
                ...filter, 
            };
            
    
            const data = await TimeshareModel.find(queryFilters)
                .where("type")
                .in(types) 
                .sort(sortBy)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .populate({
                    path: "resortId",
                    select: "name"
                });
    
            data.forEach(timeshare => {
                timeshare.price = parseInt(timeshare.price); 
            });
            
            const total = await TimeshareModel.countDocuments(queryFilters);
    
            return { error: false, total, page: parseInt(page), limit: parseInt(limit), type: typeOptions, data };
        } catch (err) {
            console.log(err);
            return { error: true, message: "Internal Server Error" };
        }
    }
    async AdminTimeshares(query, filter) {
        try {
            const { page = 1, limit = 8, search = "", sort = "price", type = "", start_date = "", end_date = "" } = query;
    
            const typeOptions = [
                "rental",
                "exchange",
            ];
    
            let types = [...typeOptions]; 
            if (type !== "") { 
                types = type.split(",");
            }
    
            let sortBy = {};
            const sortArray = sort.split(",");
            sortBy[sortArray[0]] = sortArray[1] || "asc";
    
            const queryFilters = { 
                type: { $in: types },
                ...(search !== "" && {
                    resortId: { 
                        $in: (await ResortModel.find({ "name": { $regex: search, $options: "i" } }))
                    }
                }),
                ...(start_date && { start_date: { $gte: start_date } }), 
                ...(end_date && { end_date: { $lte: end_date } }), 
            };
            
    
            const data = await TimeshareModel.find(queryFilters)
                .where("type")
                .in(types) 
                .sort(sortBy)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .populate({
                    path: "resortId",
                    select: "name"
                });
    
            data.forEach(timeshare => {
                timeshare.price = parseInt(timeshare.price); 
            });
            
            const total = await TimeshareModel.countDocuments(queryFilters);
    
            return { error: false, total, page: parseInt(page), limit: parseInt(limit), type: typeOptions, data };
        } catch (err) {
            console.log(err);
            return { error: true, message: "Internal Server Error" };
        }
    }
    
    
    
    
    

    async GetAllPosts() {
        return TimeshareModel.find({}).select('_id name start_date image end_date location price deletedAt').lean();
    }

    async GetTimeShareByTrash() {
        return TimeshareModel.find({deleted: true}).populate({
            path: 'deleted',
            select: '_id name start_date end_date current_owner location price deletedAt'
        })
            .select('_id name start_date end_date current_owner location price deletedAt')
            .lean();
    }

    async GetTimeshareByCurrentOwner(current_owner, sortBy, filter = {}) {
        let query = TimeshareModel.find({ current_owner, ...filter }).sort(sortBy).populate({
            path: 'current_owner',
            select: '_id username profilePicture role'
        }).lean();
        return query;
    }
    
    async GetTimesharExchangeByCurrentOwner(current_owner, filter) {
        try {
            const timeshares = await TimeshareModel
                .find({ current_owner, type: 'exchange', ...filter })
                .populate({
                    path: 'current_owner',
                    select: '_id username profilePicture role'
                })
                .lean();
            return timeshares;
        } catch (error) {
            console.error('Error getting timeshares by current owner:', error);
            throw error;
        }
    }
    
    // async findReservationExisted(reservationId,next) {
    //     const findReservationExisted = await ReservationModel.find({_id: reservationId})
    //     console.log(findReservationExisted)
    //     next();
    // }
    async DeleteTimeshare(timeshareId, mytimeshareId) {
        try {
        const exchangeExists = await ExchangeModel.exists({ $or: [{ timeshareId}, { mytimeshareId }] });
        const reservationExists = await ReservationModel.exists({ timeshareId});
                if (exchangeExists || reservationExists) {
            return false;
        }
        console.log(timeshareId)
        const deleteTimeshare = await TimeshareModel.delete({_id: timeshareId});
        return deleteTimeshare;
        }catch {
            throw error;
        }   
    }
     // thu vien mongoose soft-delete
    // async UpdateTimeshare(req) {
    //     const updateTimeshare = await TimeshareModel.updateOne({_id: req.params.id}, req.body)
    //     return updateTimeshare;
    // }
    // thu vien mongoose soft-delete
    async RestoreTimeshare(req) {
        const restoreTimeshare = await TimeshareModel.restore({_id: req.params.id}, req.body)
        return restoreTimeshare;
    } // thu vien mongoose soft-delete
    async ForceDeleteTimeshare(req) {
        const forceDeleteTimeshare = await TimeshareModel.deleteOne({_id: req.params.id}, req.body)
        return forceDeleteTimeshare;
    }

    async GetPostById(id, filter) {
        try {
            let query = { _id: id };
            
            if (filter) {
                query = { ...query, ...filter };
            }
            
            return await TimeshareModel.findOne(query);
        } catch (error) {
            throw error;
        }
    }
    

    async UploadPost(req, current_owner, unitId, price, start_date, end_date, resortId, images) {
        const uploadData = {
            image: images,
            current_owner: current_owner,
            unitId: unitId,
            price: price,
            start_date: start_date,
            end_date: end_date,
            resortId: resortId,
        }
        const newUpload = new TimeshareModel({...uploadData});
        return newUpload.save().catch();
    }

    async UploadPostWithS3({
                               imageFiles,
                               current_owner,
                               owner_exchange,
                               unitId,
                               numberOfNights,
                               price,
                               pricePerNight,
                               start_date,
                               end_date,
                               resortId,
                               type
                           }) {
        const imageKeys = [];
        if (!Array.isArray(imageFiles)) {
            const {key} = await uploadToS3({file: imageFiles, userId: current_owner});
            imageKeys.push(key);
        } else {
            for (const imageFile of imageFiles) {
                const {key} = await uploadToS3({file: imageFile, userId: current_owner});
                imageKeys.push(key);
            }
        }
        const uploadData = {
            images: imageKeys,
            current_owner: current_owner,
            owner_exchange:current_owner, 
            unitId: unitId,
            numberOfNights: numberOfNights,
            price: price,
            pricePerNight: pricePerNight,
            start_date: start_date,
            end_date: end_date,
            resortId: resortId,
            type: type
        }
        const newUpload = new TimeshareModel({...uploadData});
        return newUpload.save().catch();
    }

    async SubmitRentRequest(name, phone, email, userId, postId, requestId, status, verificationCode) {
        try {
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            const submitData = {
                name: name,
                phone: phone,
                postId: postId,
                userId: userId,
                requestId: requestId,
                status: status,
                email: email,
                verificationCode: verificationCode
            };
            console.log('Rent request saved:', submitRent);
            const mailOptions = {
                from: 'bwfnguyenvu@gmail.com',
                to: email,
                subject: 'Your Trip - Waiting for owner acceptance',
                text: `Hi, ${name}!\n
                Thanks for booking through NiceTrip. We received your request for the following week:\n\n
                Resort Name: Marriott's Aruba Surf Club\n
                Verification Code: ${verificationCode}\n\n
                This email was sent to ${email}\n\n`,
            };
            console.log('Confirmation email sent to:', email);
            const submitRent = new ReservationModel({...submitData});
            await transporter.sendMail(mailOptions);
            await submitRent.save();
            return submitRent;
        } catch (error) {
            console.error('Error processing rent request:', error);
            throw new ApiError('Error processing rent request', 500);
        }
    }
    async VerifyTimeshare(timeshareId) {
        const result = await TimeshareModel.findByIdAndUpdate(
            {_id: timeshareId},
            {is_verified: true}
        )
        return result;
    }
}

module.exports = new TimeshareService;