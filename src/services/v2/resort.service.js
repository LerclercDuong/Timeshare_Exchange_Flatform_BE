const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const TimeshareModel = require("../../models/timeshares");
const ResortModel = require("../../models/resorts");
const ApiError = require('../../utils/ApiError')
const {uploadToS3} = require("../../utils/s3Store");

class ResortService {

    async QueryResort(filter, options) {
        return await ResortModel.paginate(filter, options);
    }

    async GetAll() {
        return ResortModel.find({}).lean();
    }

    async GetById(id) {
        const resort = await ResortModel.findById(id).populate('units').catch(()=>{});
        if (resort) {
            return resort;
        } else {
            throw new ApiError(203, 'Resort not found');
        }
    }
    async UploadResortWithS3({
        name,
        description,
        location,
        facilities,
        attractions,
        policies,
        images,
        userId,
    }) {
        const imageKeys = [];
        if (!Array.isArray(images)) {
            const {key} = await uploadToS3({file: images, userId: userId})
            imageKeys.push(key);
        }
        else {
            for (const image of images) {
                const {key} = await uploadToS3({file: image, userId: userId})
                imageKeys.push(key);
            }
        }
        if (!Array.isArray(facilities)) {
            facilities = [facilities];
        }
        if (!Array.isArray(attractions)) {
            attractions = [attractions];
        }
        if (!Array.isArray(policies)) {
            policies = [policies];
        }
        const uploadData = {
            name: name,
            description: description,
            location: location,
            facilities: facilities,
            nearby_attractions: attractions,
            policies: policies,
            image_urls: imageKeys
        }
        const result = new ResortModel({...uploadData});
        return result.save().catch();
    }
    async AddUnit(resortId, unitId) {
        const updatedResort = await ResortModel.findByIdAndUpdate(
            resortId,
            {$push: {units: unitId}},
            {new: true} // Return the updated document
        );
        return updatedResort;
    } 
    async UpdateResort(resortId, updatedFields){
        try {
            const resort = await ResortModel.findById(resortId);
            if (!resort) {
                throw new ApiError(203, 'Resort not found');
            }
            Object.assign(resort, updatedFields);
            return await resort.save();
        } catch (error) {
            throw new Error(`Error updating resort: ${error.message}`);
        }
    }
    async GetAllPostByResortId(id) {
        try {
            const resortId = await ResortModel.findById(id);
            if (resortId) {
                return TimeshareModel.find({ resortId: id }).lean();
            } else {
                throw new ApiError(203, 'Resort not found');
            }
        } catch (error) {
            throw new ApiError(500, 'Internal Server Error');
        }
    }
    
    async CountResort(){
        try {
            const countResort = await ResortModel.countDocuments({});
            return countResort;
        }
        catch {
            return { error: true, message: "Internal Server Error" };
        }
    }
}

module.exports = new ResortService;