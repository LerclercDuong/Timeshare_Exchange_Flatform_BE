const bcrypt = require('bcrypt');
const moment = require("moment");
const TimeshareModel = require("../../models/timeshares");
const ResortModel = require("../../models/resorts");
const UnitModel = require("../../models/units");
const ApiError = require('../../utils/ApiError')
const {uploadToS3} = require("../../utils/s3Store");

class ResortService {

    async QueryResort(filter, options) {
        return ResortModel.paginate(filter, options);
    }

    async GetAll() {
        return ResortModel.find({}).lean();
    }
    async GetActiveResorts() {
        return ResortModel.find({deleted: false}).lean();
    }

    async GetById(id) {
        const resort = await ResortModel.findById(id).populate('units');
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
    async UpdateResortPartial(resortId, imageFiles, data, userId) {
        const imageKeys = [];
        if(data.images){
            if (!Array.isArray(data.images)) {
                imageKeys.push(data.images);
            } else {
                for (const image of data.images) {
                    imageKeys.push(image);
                }
            }
        }
        if (imageFiles) {
            if (!Array.isArray(imageFiles)) {
                const {key} = await uploadToS3({file: imageFiles, userId: userId});
                imageKeys.push(key);
            }
            else {
                for (const imageFile of imageFiles) {
                    const {key} = await uploadToS3({file: imageFile, userId: userId});
                    imageKeys.push(key);
                }
            }
        }
        return await ResortModel.updateOne({_id: resortId}, {$set: { ...data, image_urls: imageKeys }}, {new: true})
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
    async DeleteResort(resortId) {
        return await ResortModel.delete({_id: resortId});
    }
    async RestoreResort(resortId) {
        return await ResortModel.restore({_id: resortId});
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