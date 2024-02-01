const express = require('express');
const router = express.Router();
const reservationRouter = require('../../controllers/v2/reservation.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.post('/confirm/:reservationId', reservationRouter.ConfirmRent);



module.exports = router;