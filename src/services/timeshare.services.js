const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../api/user');
const TimeshareModel = require("../models/timeshares");

class TimeshareService {

    async GetTimeshare() {
        return TimeshareModel
            .find()
            .populate({
                path: 'current_owner',
                select: '_id username profilePicture role'
            })
            .select('_id name start_date end_date current_owner location price')
            .lean();
    }
    async GetTimeShareByTrash(){
        return TimeshareModel.find({deleted: true}).populate({
            path: 'deleted',
            select: '_id name start_date end_date current_owner location price deletedAt'
        })
        .select('_id name start_date end_date current_owner location price deletedAt')
        .lean();
    }

    async GetTimeshareByCurrentOwner(current_owner) {
        return TimeshareModel
            .find({current_owner})
            .populate({
                path: 'current_owner',
                select: '_id username profilePicture role'
            })
            .select('_id name start_date end_date current_owner location price')
            .lean();
    }


    async PostTimeshare(name, start_date, end_date, current_owner, location, price) {
        const nameExists = await TimeshareModel.findOne({name: name});
        if (nameExists) throw new Error("Name is exist")
        const timeshareData = {
            name: name,
            start_date: start_date,
            end_date: end_date,
            current_owner: current_owner,
            location: location,
            price: price,
        }
        const newTimeshare = new TimeshareModel({...timeshareData});
        return newTimeshare.save().catch();
    }

    async DeleteTimeshare(req) {
        const deleteTimeshare = await TimeshareModel.delete({_id: req.params.id}, req.body)
        return deleteTimeshare;
    } // thu vien mongoose soft-delete
    async UpdateTimeshare(req) {
        const updateTimeshare = await TimeshareModel.updateOne({_id: req.params.id}, req.body)
        return updateTimeshare;
    } // thu vien mongoose soft-delete
    async RestoreTimeshare(req) {
        const restoreTimeshare = await TimeshareModel.restore({_id: req.params.id}, req.body)
        return restoreTimeshare;
    } // thu vien mongoose soft-delete
    async ForceDeleteTimeshare(req) {
        const forceDeleteTimeshare = await TimeshareModel.deleteOne({_id: req.params.id}, req.body)
        return forceDeleteTimeshare;
    }
}

module.exports = new TimeshareService;