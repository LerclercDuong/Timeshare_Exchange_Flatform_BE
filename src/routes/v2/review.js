const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/v2/review.controller');
const CheckAuth = require('../../middlewares/auth');

router.get('/resort/:resortId', reviewController.GetReviewByResortId);
router.post('/', CheckAuth, reviewController.CreateReview);

module.exports = router;