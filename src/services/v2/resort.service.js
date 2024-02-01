const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const PostModel = require("../../models/posts");

const ResortModel = require("../../models/resorts");
const ApiError = require('../../utils/ApiError')

class ResortService {

    async Query() {

    }

    async GetAll() {
        return ResortModel.find({}).lean();
    }

    async GetById(id) {
        const resort = await ResortModel.findById(id).catch(()=>{});
        if (resort) {
            return resort;
        } else {
            throw new ApiError(203, 'Resort not found');
        }
    }

    async GetAllPostByResortId(id) {
        try {
            const resortId = await ResortModel.findById(id);
            if (resortId) {
                return PostModel.find({ resortId: id }).lean();
            } else {
                throw new ApiError(203, 'Resort not found');
            }
        } catch (error) {
            throw new ApiError(500, 'Internal Server Error');
        }
    }
    
}

module.exports = new ResortService;