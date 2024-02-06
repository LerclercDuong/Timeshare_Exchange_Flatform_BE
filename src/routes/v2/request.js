const express = require('express');
const router = express.Router();
const requestRouter = require('../../controllers/v2/request.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

/**
 * @openapi
 * /api/v2/request/rent:
 *   post:
 *     tags:
 *       - Request API
 *     summary: Request rent Timeshare
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
 *               userId:
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
 *               type: 
 *                 type: string
 *                 enum:
 *                   - rent
 *                   - exchange
 *                 default: 'rent'
 *             required:
 *               - userId
 *               - postId
 *               - status
 *               - type
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Request successful
 *               data: {}
 *       '204':
 *         description: No content
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Request failed
 *               data: {}
 */
router.post('/rent', requestRouter.RequestRent);

// router.get('/exchange', requestRouter.a);

module.exports = router;