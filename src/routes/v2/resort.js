const express = require('express');
const router = express.Router();
const resortController = require('../../controllers/v2/resort.controller');
const multer = require('multer');
const {auth, authorizeAdmin} = require('../../middlewares/auth');
const upload = multer({ dest: 'src/public/img/'});

router.get('/', resortController.GetResort);
router.post('/', auth, authorizeAdmin, resortController.UploadResort);
router.get('/:id', resortController.GetResortById);
router.get('/get-all', resortController.GetAllResorts);
router.put('/update/:id', resortController.UpdateResort);
router.get('/:id/timeshare-rentals', resortController.GetAllPostByResortId);
router.get('/count/all-resort', resortController.CountResort);


module.exports = router;
/**
 * @openapi
 * info:
 *   title: Resort API
 *   version: 1.0.0
 *   description: API for managing resorts
 *
 * paths:
 *    /api/v2/resort?:
 *     get:
 *       summary: Get resorts by filter
 *       tags:
 *       - Resort API
 *       parameters:
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: Filter resorts by name
 *         - in: query
 *           name: location
 *           schema:
 *             type: string
 *           description: Filter resorts by location
 *         # Add more query parameters as needed
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               example:
 *                 resorts:
 *                   - name: Sample Resort
 *                     location: Sample Location
 *                     description: Sample Description
 *                     facilities:
 *                       - Facility 1
 *                       - Facility 2
 *                     nearby_attractions:
 *                       - Attraction 1
 *                       - Attraction 2
 *                     policies:
 *                       - Policy 1
 *                       - Policy 2
 *                     image_urls:
 *                       - Image URL 1
 *                       - Image URL 2
 *
 *    /api/v2/resort/create:
 *     resort:
 *       summary: Create a new resort
 *       tags:
 *       - Resort API
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: Sample Resort
 *               location: Sample Location
 *               description: Sample Description
 *               facilities:
 *                 - Facility 1
 *                 - Facility 2
 *               nearby_attractions:
 *                 - Attraction 1
 *                 - Attraction 2
 *               policies:
 *                 - Policy 1
 *                 - Policy 2
 *               image_urls:
 *                 - Image URL 1
 *                 - Image URL 2
 *       responses:
 *         '201':
 *           description: Resort created successfully
 *    /api/v2/resort/{resortId}:
 *     get:
 *       summary: Get a specific resort by ID
 *       tags:
 *       - Resort API
 *       parameters:
 *         - in: path
 *           name: resortId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the resort to retrieve
 *       responses:
 *         '200':
 *           description: Successful response
 *           content:
 *             application/json:
 *               example:
 *                 name: Sample Resort
 *                 location: Sample Location
 *                 description: Sample Description
 *                 facilities:
 *                   - Facility 1
 *                   - Facility 2
 *                 nearby_attractions:
 *                   - Attraction 1
 *                   - Attraction 2
 *                 policies:
 *                   - Policy 1
 *                   - Policy 2
 *                 image_urls:
 *                   - Image URL 1
 *                   - Image URL 2
 *    /api/v2/resort/update/{resortId}:
 *     put:
 *       summary: Update a specific resort by ID
 *       tags:
 *       - Resort API
 *       parameters:
 *         - in: path
 *           name: resortId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the resort to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: Updated Resort
 *       responses:
 *         '200':
 *           description: Resort updated successfully
 *    /api/v2/resort/delete/{resortId}:
 *     delete:
 *       summary: Delete a specific resort by ID
 *       tags:
 *       - Resort API
 *       parameters:
 *         - in: path
 *           name: resortId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the resort to delete
 *       responses:
 *         '204':
 *           description: Resort deleted successfully
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, DefaultSchemaOptions, {name: {type: StringConstructor, required: boolean}, policies: [{type: StringConstructor}], description: {type: StringConstructor, required: boolean}, image_urls: [{type: StringConstructor}], location: {type: StringConstructor, required: boolean}, nearby_attractions: [{type: StringConstructor}], facilities: [{type: StringConstructor}]}, HydratedDocument<FlatRecord<{name: {type: StringConstructor, required: boolean}, policies: [{type: StringConstructor}], description: {type: StringConstructor, required: boolean}, image_urls: [{type: StringConstructor}], location: {type: StringConstructor, required: boolean}, nearby_attractions: [{type: StringConstructor}], facilities: [{type: StringConstructor}]}>, {}>>}
 */