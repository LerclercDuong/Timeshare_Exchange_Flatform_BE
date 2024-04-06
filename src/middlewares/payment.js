import ApiError from "../utils/ApiError";
const { StatusCodes } = require('http-status-codes');
const { GetPostById } = require("../services/v2/timeshare.service");
const TimeshareModel = require("../models/timeshares");

export const CheckRentalPayment = async (req, res, next) => {
    try {
        const timeshareId = req.body.timeshareId;
        // Check if the timeshare was rented or exchanged
        const timeshare = await TimeshareModel.findById(timeshareId);
        if (!timeshare || !timeshare.is_bookable) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Payment failed");
        }
        next();
    } catch (error) {
        next(error);
    }
}
