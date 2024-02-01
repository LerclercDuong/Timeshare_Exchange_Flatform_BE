const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const RequestModel = require("../../models/requests");
const TimeshareModel = require("../../models/timeshares");
const ApiError = require('../../utils/ApiError');

class RequestService {
    RequestRent = async (userId, postId, status, type) => {
        try {
            // Add any additional processing logic here
            const rentData = {
                userId: userId, 
                postId: postId,
                status: status,
                type: type,
            };

            const newRent = new RequestModel({...rentData});
            await newRent.save();
            // Update the availability in the Timeshares model
            // await TimeshareModel.findByIdAndUpdate(timeshareId, { availability: false });

            return newRent;
        } catch (error) {
            throw new ApiError('Error processing rent request', 500); // Handle error appropriately
        }
    }

    
}

module.exports = new RequestService;
