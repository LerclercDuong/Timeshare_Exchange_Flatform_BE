const express = require('express');
const exphbs  = require('express-handlebars');
const UserId = require('./user.js');
const {propertiesServices} = require('../services');


const Property = require('../models/properties');
const { mutipleMongooseToObject }= require('../utils/mongoose')

const app = express();
const fs = require('fs');
const path = require('path');


const {StatusCodes} = require('http-status-codes');

class Properties {

    async GetAllProperties(req, res, next) {
        try {
            const propertiesList = await propertiesServices.GetAllProperties()
            .then(properties => res.render('timeshare/home.hbs', {
                properties: mutipleMongooseToObject (properties) // dùng để gọi nhiều object
            }))
        } catch {
            res.status(StatusCodes.NO_CONTENT).json({message: 'Timeshare not found'})
        }
    }

    async PostProperty(req, res) {
        try {
            const { nameProperty, location } = req.body;

            const postProperty = await propertiesServices.PostProperty(nameProperty, location);
    
            // Respond with success status and uploaded files information
            res.status(200).json({ postProperty });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    // show(req, res, next){
    //     Property.findOne({})
    //         .then(properties => {
    //             res.render('timeshare/home.hbs', { properties: mongooseToObject(properties)});
    //         })
    //         .catch(next);
    // } 

    // stored(req, res, next){
    //     Property.find({})
    //         .then(properties => res.render('timeshare/test.hbs', {
    //             properties: mutipleMongooseToObject (properties) // dùng để gọi nhiều object
            
    //         }))
    //         .catch(next);
    //     }

    

    // async  Upload(req, res) {
        
    //     try {
    //         const uploadedFiles = req.files;
        
    //         // Create an array to store information about each uploaded image
    //         const images = [];
        
    //         for (const uploadedFile of uploadedFiles) {
    //         // Extract the filename without extension
    //         const fileNameWithoutExtension = path.parse(uploadedFile.filename).name;
        
    //         // Specify the new file name with ".png" extension
    //         const newFileName = fileNameWithoutExtension + '.png';
        
    //         // Build the new file path
    //         const newFilePath = path.join(uploadedFile.destination, newFileName);
        
    //         // Rename the file
    //         fs.renameSync(uploadedFile.path, newFilePath);
        
    //         // Add information about the uploaded image to the images array
    //         images.push({ path: newFilePath });
    //         }
        
    //         const { name, price, start_date, end_date, location } = req.body;
        
    //         // Assuming timeshareServices.Upload is an asynchronous function that handles database operations
    //         const uploadedFileInfo = await timeshareServices.Upload(
    //         req,
    //         name,
    //         price,
    //         start_date,
    //         end_date,
    //         location,
    //         images
    //         );
        
    //         // Log information about the uploaded files
    //         console.log('Uploaded files information:', uploadedFileInfo);
        
    //         // Respond with success status and uploaded files information
    //         res.status(200).json({ uploadedFileInfo });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
            
    // };
}
module.exports = new Properties;