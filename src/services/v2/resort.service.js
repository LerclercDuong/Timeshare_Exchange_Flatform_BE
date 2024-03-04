const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const TimeshareModel = require("../../models/timeshares");
const ResortModel = require("../../models/resorts");
const ApiError = require('../../utils/ApiError')

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
}

module.exports = new ResortService;