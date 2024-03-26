const express = require('express');
const router = express.Router();
const reservationRouter = require('../../controllers/v2/reservation.controller');
const paymentController = require('../../controllers/v2/payment.controller')
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });
const {auth: CheckAuth} = require('../../middlewares/auth');

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
router.get('/:reservationId', CheckAuth, reservationRouter.GetReservationById);
router.get('/of-user/:userId', CheckAuth, reservationRouter.GetReservationOfUser);
router.get('/of-timeshare/:timeshareId', CheckAuth, reservationRouter.GetReservationOfPost);
router.post('/create', CheckAuth, reservationRouter.MakeReservation);
router.post('/confirm/:reservationId', CheckAuth, reservationRouter.ConfirmRent);
router.patch('/:reservationId/confirm', CheckAuth, reservationRouter.ConfirmReservationByToken);
router.patch('/:reservationId/accept', CheckAuth, reservationRouter.AcceptReservationByOwner);
router.patch('/:reservationId/deny', CheckAuth, reservationRouter.DenyReservationByOwner);
router.put('/canceled/:reservationId', CheckAuth, reservationRouter.CancelMyRentalRequest);
router.delete('/:reservationId', CheckAuth, reservationRouter.DeleteMyRentalRequest);
router.get('/get-all/reservation', reservationRouter.GetAllReservation);




module.exports = router;