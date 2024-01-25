const express = require('express');
const Timeshare = require('../models/timeshares');
const exphbs  = require('express-handlebars');
const UserId = require('./user.js');
const {timeshareServices} = require('../services');
const {propertiesServices} = require('../services');
const Property = require('../models/properties');


const app = express();
const fs = require('fs');
const path = require('path');

const { mutipleMongooseToObject }= require('../utils/mongoose')

const {StatusCodes} = require('http-status-codes');

class Timeshares {

    async GetAllTimeshare(req, res, next) {
        try {
            const timeshareList = await timeshareServices.GetAllTimeshare();
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

    async ForceDeleteTimeshare(req, res, next) {
        try {
            const forceDeleteTimeshare = await timeshareServices.ForceDeleteTimeshare(req);
            res.status(StatusCodes.OK).json(forceDeleteTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

    async GetTimeShareByTrash(req, res, next) {
        try {
            const trashList = await timeshareServices.GetTimeShareByTrash();
            res.status(StatusCodes.OK).json(trashList)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

    async PostTimeshare(req, res, next) {
        res.render('timeshare/home.hbs')
    }

    async PropertyPostTimeshare(req, res, next) {
        try {
            const propertiesList = await propertiesServices.PropertyPostTimeshare()
            .then(properties => res.render('timeshare/home.hbs', {
                properties: mutipleMongooseToObject (properties) // dùng để gọi nhiều object
            }))
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }   
//   async PostTimeshare(req, res, next) {
//         const {name, start_date, end_date, current_owner, location, price} = req.body;
//         try {
//             const timeshareData = await timeshareServices.PostTimeshare(name, start_date, end_date, current_owner, location, price);
//             res.status(StatusCodes.CREATED).json({timeshareData})
//         } catch (err) {
//             res.status(StatusCodes.UNAUTHORIZED).json({message: err.message})
//         }
//     }

    async  Upload(req, res) {
        try {
            const uploadedFiles = req.files;

            const images = [];

            for (const uploadedFile of uploadedFiles) {
                const fileNameWithoutExtension = path.parse(uploadedFile.filename).name;
                const newFileName = fileNameWithoutExtension + '.png';
                const newFilePath = path.join(uploadedFile.destination, newFileName);

                fs.renameSync(uploadedFile.path, newFilePath);

                images.push({ path: newFilePath });
            }

            const { name, nameProperty, price, start_date, end_date } = req.body;

            const uploadedFileInfo = await timeshareServices.Upload(
                req,
                name,
                nameProperty,
                price,
                start_date,
                end_date,
                images
            );

            console.log('Uploaded files information:', uploadedFileInfo);

            res.status(200).json({ uploadedFileInfo });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
module.exports = new Timeshares;