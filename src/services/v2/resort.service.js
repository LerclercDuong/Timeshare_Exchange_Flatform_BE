const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const TimeshareModel = require("../../models/timeshares");
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
}

module.exports = new ResortService;