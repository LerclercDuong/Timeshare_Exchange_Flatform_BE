const UserId = require('./user.js');
const {timeshareServices} = require('../services');

const {StatusCodes} = require('http-status-codes');

class Timeshares {
    async PostTimeshare(req, res, next) {
        const {name, start_date, end_date, current_owner, location, price} = req.body;
        try {
            const timeshareData = await timeshareServices.PostTimeshare(name, start_date, end_date, current_owner, location, price);
            res.status(StatusCodes.CREATED).json({timeshareData})
        } catch (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: err.message})
        }
    }

    async GetAllTimeshare(req, res, next) {
        try {
            const timeshareList = await timeshareServices.GetTimeshare();
            res.status(StatusCodes.OK).json(timeshareList)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

    async GetTimeshareByCurrentOwner(req, res, next) {
        const {current_owner} = req.params;
        const timeshareData = await timeshareServices.GetTimeshareByCurrentOwner(current_owner);
        if (timeshareData) {
            res.status(StatusCodes.OK).json(timeshareData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
    }

    async DeleteTimeshare(req, res, next) {
        try {
            const deleteTimeshare = await timeshareServices.DeleteTimeshare(req);
            res.status(StatusCodes.OK).json(deleteTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

    async UpdateTimeshare(req, res, next) {
        try {
            const updateTimeshare = await timeshareServices.UpdateTimeshare(req);
            res.status(StatusCodes.OK).json(updateTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

    async RestoreTimeshare(req, res, next) {
        try {
            const restoreTimeshare = await timeshareServices.RestoreTimeshare(req);
            res.status(StatusCodes.OK).json(restoreTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

}

module.exports = new Timeshares;