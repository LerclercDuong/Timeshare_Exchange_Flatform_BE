const express = require('express');
const router = express.Router();
const timeshareController = require('../../controllers/v2/timeshare.controller');
const multer = require('multer');
const { plugin } = require('mongoose');
const upload = multer({ dest: 'src/public/img/' });
const {auth: CheckAuth} = require('../../middlewares/auth');
const AuthorizeTimeshare = require('../../middlewares/timeshare')
const CountUploadTimeshareByUser = require('../../middlewares/servicePack')
const CacheMiddleware = require('../../middlewares/cache')

// router.get('/list', Post.GetAllTimeshare); //tat ca
// router.get('/current-owner/:current_owner', Post.GetTimeshareByCurrentOwner); //Hien thi timeshare by Owner
// router.delete('/:id', Post.DeleteTimeshare); // xoa tam thoi
// router.delete('/:id/force', Post.ForceDeleteTimeshare); //xoa vinh vien
// router.put('/:id', Post.UpdateTimeshare); //cap nhat
// router.patch('/:id/restore', Post.RestoreTimeshare); //khoi phuc
// router.get('/:id/trash-list', Post.GetTimeShareByTrash); //danh sach timehshare trong thung rac
// router.get('/post-timeshare', Post.PostTimeshare); //
router.get('/', CacheMiddleware, timeshareController.GetPosts);
router.get('/query',timeshareController.GetPosts);
router.get('/all', CheckAuth, timeshareController.AdminTimeshares);

router.post('/upload', CheckAuth, CountUploadTimeshareByUser, timeshareController.UploadPostWithS3);

router.get('/countTimeshare', timeshareController.CountTimeshare);
router.get('/countAllTimeshare', timeshareController.CountAllTimeshare);
router.get('/count-timeshare-success', timeshareController.CountTimeshareSuccess);


// //--v2--//
// router.get('/list-timeshare-availability', Post.PostTimeshare); //
// router.get('/:id', Post.GetTimeshareById); //
// router.post('/:postId/book', Post.SubmitRentRequest); // 

/**
 * @openapi
 * /api/v2/timeshare/list:
 *   get:
 *     tags:
 *       - Post API
 *     summary: Get all timeshares
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Timeshares found
 *               data:
 *                 - _id: "12345"
 *                   name: "Sample Timeshare"
 *                   start_date: "2022-02-01"
 *                   end_date: "2022-02-15"
 *                   current_owner: "John Doe"
 *                   location: "Sample Location"
 *                   price: 1000.0
 *                   deletedAt: null
 *               # Additional timeshare objects...
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Timeshares not found
 *               data: []
 */
router.get('/list', timeshareController.GetAllPosts);

/**
 * @openapi
 * /api/v2/timeshare/current-owner/{current_owner}:
 *   get:
 *     tags:
 *       - Post API
 *     summary: Get timeshares by current owner
 *     parameters:
 *       - in: path
 *         name: current_owner
 *         required: true
 *         description: The username of the current owner
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Timeshares found
 *               data:
 *                 - _id: "12345"
 *                   name: "Sample Timeshare"
 *                   start_date: "2022-02-01"
 *                   end_date: "2022-02-15"
 *                   current_owner: "John Doe"
 *                   location: "Sample Location"
 *                   price: 1000.0
 *                   deletedAt: null
 *               # Additional timeshare objects...
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Timeshares not found
 *               data: []
 */
router.get('/current-owner/:current_owner', timeshareController.GetTimeshareByCurrentOwner);
router.get('/exchange/:current_owner', timeshareController.GetTimesharExchangeByCurrentOwner);
/**
 * @openapi
 * /api/v2/timeshare/{id}:
 *   delete:
 *     tags:
 *       - Post API
 *     summary: Temporarily delete a timeshare
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the timeshare to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Deleted
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Delete failed
 *               data: {}
 */
router.delete('/:timeshareId',  timeshareController.DeleteTimeshare);
// CheckAuth, AuthorizeTimeshare,
/**
 * @openapi
 * /api/v2/timeshare/{id}/force:
 *   delete:
 *     tags:
 *       - Post API
 *     summary: Permanently delete a timeshare
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the timeshare to be permanently deleted
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Force Deleted Successful
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Force failed
 *               data: {}
 */
router.delete('/:id/force', CheckAuth, AuthorizeTimeshare, timeshareController.ForceDeleteTimeshare);

/**
 * @openapi
 * /api/v2/timeshare/{id}:
 *   put:
 *     tags:
 *       - Post API
 *     summary: Update a timeshare
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the timeshare to be updated
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Updated
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Update Failed
 *               data: {}
 */
router.put('/:id', CheckAuth, AuthorizeTimeshare, timeshareController.UpdateTimeshare);

/**
 * @openapi
 * /api/v2/timeshare/{id}/restore:
 *   patch:
 *     tags:
 *       - Post API
 *     summary: Restore a temporarily deleted timeshare
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the timeshare to be restored
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Restored
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Restore failed
 *               data: {}
 */
router.patch('/:id/restore', CheckAuth, AuthorizeTimeshare, timeshareController.RestoreTimeshare);

/**
 * @openapi
 * /api/v2/timeshare/{id}/trash-list:
 *   get:
 *     tags:
 *       - Post API
 *     summary: Get a list of timeshares in the trash
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the timeshare to get trash list from
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Trash list found
 *               data:
 *                 - _id: "12345"
 *                   name: "Sample Timeshare"
 *                   start_date: "2022-02-01"
 *                   end_date: "2022-02-15"
 *                   current_owner: "John Doe"
 *                   location: "Sample Location"
 *                   price: 1000.0
 *                   deletedAt: "2022-02-05T12:00:00Z"
 *               # Additional timeshare objects...
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Trash list not found
 *               data: []
 */
router.get('/:id/trash-list', CheckAuth, timeshareController.GetTimeShareByTrash);

/**
 * @openapi
 * /api/v2/timeshare/post-timeshare:
 *   get:
 *     tags:
 *       - Post API
 *     summary: Render the post timeshare page
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           text/html:
 *             example: Post timeshare page rendered successfully
 */
router.get('/post-timeshare', CheckAuth, timeshareController.PostTimeshare);

/**
 * @openapi
 * /api/v2/timeshare/upload:
 *   post:
 *     tags:
 *       - Post API
 *     summary: Upload a new timeshare
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               current_owner:
 *                 type: string
 *               unitId:
 *                 type: string
 *               price:
 *                 type: number
 *               start_date:
 *                 type: Date
 *               end_date:
 *                 type: Date
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *               resortId:
 *                 type: string
 *             required:
 *               - image
 *               - current_owner  # Ensure that current_owner is marked as required
 *               - price
 *               - start_date
 *               - end_date
 *               - resortId
 *               - unitId
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Uploaded successful
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Upload failed
 *               data: {}
 */
// router.post('/upload', upload.array('image'), postController.UploadPost);

// /**
//  * @openapi
//  * /api/v2/post/list-timeshare-availability:
//  *   get:
//  *     tags:
//  *       - Post API
//  *     summary: Get the availability of all timeshares
//  *     responses:
//  *       '200':
//  *         description: Successful response
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: success
//  *               message: Timeshare availability found
//  *               data:
//  *                 - _id: "12345"
//  *                   name: "Sample Timeshare"
//  *                   start_date: "2022-02-01"
//  *                   end_date: "2022-02-15"
//  *                   current_owner: "John Doe"
//  *                   location: "Sample Location"
//  *                   price: 1000.0
//  *                   deletedAt: null
//  *                   availability: true
//  *               # Additional timeshare objects...
//  *       '204':
//  *         description: No content
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: error
//  *               message: Timeshare availability not found
//  *               data: []
//  */
// router.get('/list-timeshare-availability', Post.PostTimeshare);

/**
 * @openapi
 * /api/v2/timeshare/{id}:
 *   get:
 *     tags:
 *       - Post API
 *     summary: Get a timeshare by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the timeshare to be retrieved
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Timeshare id found
 *               data:
 *                 _id: "12345"
 *                 name: "Sample Timeshare"
 *                 start_date: "2022-02-01"
 *                 end_date: "2022-02-15"
 *                 current_owner: "John Doe"
 *                 location: "Sample Location"
 *                 price: 1000.0
 *                 deletedAt: null
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Id not found
 *               data: {}
 */
router.get('/:id', timeshareController.GetPostById);

/**
 * @openapi
 * /api/v2/timeshare/{postId}/book:
 *   post:
 *     tags:
 *       - Post API
 *     summary: Submit a rent request for a timeshare
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post for which the rent request is being submitted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: number
 *               email:
 *                 type: string
 *               userId:
 *                 type: string
 *               requestId:
 *                 type: string
 *               postId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: 
 *                   - pending
 *                   - confirmed
 *                   - canceled
 *                 default: 'pending'
 *               verificationCode:
 *                 type: number
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - userId
 *               - requestId
 *               - postId
 *               - status
 *               - verificationCode
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Submitted successfully
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Submission failed
 *               data: {}
 */
router.post('/:postId/book', CheckAuth, timeshareController.SubmitRentRequest);
router.patch('/verify/:id', CheckAuth, timeshareController.VerifyTimeshare)


module.exports = router;