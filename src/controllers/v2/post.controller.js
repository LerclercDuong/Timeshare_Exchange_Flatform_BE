const express = require('express');
const PostController = require('../../models/timeshares');
const exphbs  = require('express-handlebars');
const UserId = require('./user.controller.js');
const {postServices} = require('../../services/v2');
const app = express();
const fs = require('fs');
const path = require('path');


const {StatusCodes} = require('http-status-codes');
const postService = require('../../services/v2/post.service');

class Timeshares {

    async GetAllTimeshare(req, res, next) {
        try {
            const timeshareList = await postServices.GetAllTimeshare();
            res.status(StatusCodes.OK).json(timeshareList)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }

    async GetTimeshareByCurrentOwner(req, res, next) {
        const {current_owner} = req.params;
        const timeshareData = await timeshareServices.GetTimeshareByCurrentOwner(current_owner);
        if (timeshareData) {
            res.status(StatusCodes.OK).json(timeshareData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
    }

    async DeleteTimeshare(req, res, next) {
        try {
            const deleteTimeshare = await timeshareServices.DeleteTimeshare(req);
            res.status(StatusCodes.OK).json(deleteTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }

    async UpdateTimeshare(req, res, next) {
        try {
            const updateTimeshare = await timeshareServices.UpdateTimeshare(req);
            res.status(StatusCodes.OK).json(updateTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }

    async RestoreTimeshare(req, res, next) {
        try {
            const restoreTimeshare = await timeshareServices.RestoreTimeshare(req);
            res.status(StatusCodes.OK).json(restoreTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }

    async ForceDeleteTimeshare(req, res, next) {
        try {
            const forceDeleteTimeshare = await timeshareServices.ForceDeleteTimeshare(req);
            res.status(StatusCodes.OK).json(forceDeleteTimeshare)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }

    async GetTimeShareByTrash(req, res, next) {
        try {
            const trashList = await timeshareServices.GetTimeShareByTrash();
            res.status(StatusCodes.OK).json(trashList)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }
    async GetTimeshareById(req, res, next) {
        const { id } = req.params;
        try {
            const getTimeshareById = await postServices.GetTimeshareById(id);
            res.status(StatusCodes.OK).json(getTimeshareById)
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'PostController not found'})
        }
    }

    async PostTimeshare(req, res, next) {
        res.render('timeshare/home.hbs')
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
        
            // Create an array to store information about each uploaded image
            const images = [];
        
            for (const uploadedFile of uploadedFiles) {
            // Extract the filename without extension
            const fileNameWithoutExtension = path.parse(uploadedFile.filename).name;
        
            // Specify the new file name with ".png" extension
            const newFileName = fileNameWithoutExtension + '.png';
        
            // Build the new file path
            const newFilePath = path.join(uploadedFile.destination, newFileName);
        
            // Rename the file
            fs.renameSync(uploadedFile.path, newFilePath);
        
            // Add information about the uploaded image to the images array
            images.push({ path: newFileName });
            }
        
            const { current_owner, resortId, unitId, price, start_date, end_date } = req.body;
        
            // Assuming timeshareServices.Upload is an asynchronous function that handles database operations
            const uploadedFileInfo = await postService.Upload(
            req,
            resortId,
            unitId,
            current_owner,
            price,
            start_date,
            end_date,
            images
            );
        
            // Log information about the uploaded files
            console.log('Uploaded files information:', uploadedFileInfo);
        
            // Respond with success status and uploaded files information
            res.status(200).json({ uploadedFileInfo });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
            
    };

    async SubmitRentRequest(req, res) {
        try {
            const { name, phone, userId, postId, requestId, status } = req.body;
            const submitRentRequest = await postServices.SubmitRentRequest(
                name,
                phone,
                userId,
                postId,
                requestId,
                status,
            );
            res.status(StatusCodes.OK).json(submitRentRequest);
        } catch (error) {
            console.error(error);
            res.status(StatusCodes.NO_CONTENT).json({ message: 'RentController not found' });
        }
    }
}
module.exports = new Timeshares;