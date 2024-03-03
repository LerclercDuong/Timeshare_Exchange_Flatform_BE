const express = require('express');
const router = express.Router();
const reservationController = require('../../controllers/v2/reservation.controller');
const paymentController = require('../../controllers/v2/payment.controller')
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });
const emailController = require('../../controllers/v2/email.controller');
/**
 * @openapi
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
 *               $ref: ''
 *       '404':
 *         description: Reservation not found
 *       '500':
 *         description: Error confirming reservation
 */
// router.patch('/:reservationId/confirm', reservationRouter.ConfirmReservation);
router.get('/:reservationId', reservationController.GetReservationById);
router.get('/of-user/:userId', reservationController.GetReservationOfUser);
router.get('/of-post/:postId', reservationController.GetReservationOfPost);
router.post('/create', reservationController.MakeReservation);
router.post('/confirm/:reservationId', reservationController.ConfirmRent);
router.patch('/:reservationId/confirm', reservationController.ConfirmReservationByToken);

module.exports = router;