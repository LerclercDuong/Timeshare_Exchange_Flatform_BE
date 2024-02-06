const express = require('express');
const router = express.Router();
const reservationRouter = require('../../controllers/v2/reservation.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

/**
 * @swagger
 * /api/v2/reservation/confirm/{reservationId}:
 *   post:
 *     tags: 
 *       - Reservation API
 *     summary: Confirm a reservation
 *     description: Confirm a reservation by providing the reservation ID.
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         description: ID of the reservation to be confirmed
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully confirmed reservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       '404':
 *         description: Reservation not found
 *       '500':
 *         description: Error confirming reservation
 */
router.post('/confirm/:reservationId', reservationRouter.ConfirmRent);


module.exports = router;