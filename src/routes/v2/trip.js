const express = require('express');
const router = express.Router();
const tripController = require('../../controllers/v2/trip.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/'});

router.get('/of/:userId', tripController.GetTripOfUser);


module.exports = router;