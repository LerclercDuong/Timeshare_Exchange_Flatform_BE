const UserId = require('./user.js');
const timeshareService = require('../services/timeshare.services.js');

const {StatusCodes} = require('http-status-codes');

class Timeshares {
    async PostTimeshare(req, res, next) {
        const {name,start_date, end_date,current_owner, username, location, price} = req.body;
        try {
                const timeshareData = await timeshareService.PostTimeshare(name, start_date, end_date,current_owner, username, location, price);
                res.status(StatusCodes.CREATED).json({timeshareData})
        } catch (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: err.message})
        }
    }
    async GetAllTimeshare(req, res, next) {
        try{
            const timeshareList = await timeshareService.GetTimeshare();
            res.status(StatusCodes.OK).json(timeshareList)
        }
        catch{
            res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
        }
    }

    async GetTimesharerByCurrentOwner(req, res, next) {
        const { current_owner } = req.params;
        const timeshareData = await timeshareService.GetTimesharerByCurrentOwner(current_owner);
        if (timeshareData) {
            res.status(StatusCodes.OK).json(timeshareData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
    }

}

module.exports = new Timeshares;