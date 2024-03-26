const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/v2/review.controller');
const {auth: CheckAuth} = require('../../middlewares/auth');
const AuthorizeReview = require('../../middlewares/review');

router.get('/resort/:resortId', reviewController.GetReviewByResortId);
router.delete('/:id', CheckAuth, AuthorizeReview, reviewController.DeleteReview);
router.post('/', CheckAuth, reviewController.CreateReview);

module.exports = router;