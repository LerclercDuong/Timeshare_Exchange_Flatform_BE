const { StatusCodes } = require('http-status-codes');
const { GetReviewById } = require("../services/v2/review.service");

const AuthorizeReview = async (req, res, next) => {
    const user = req.user.data;
    const review = await GetReviewById(req.params.id);
    //Check if timeshare found
    if (review) {
        //Check if the user has admin role or the review poster
        if (user.role === 'admin' || review.userId.toString() === user._id.toString()) {
            //Append requested review data for further use
            req.review = {
                data: review,
            }
            next();
        }
        else res.status(StatusCodes.FORBIDDEN).json({message: 'Access forbidden'});
    }
    else res.status(StatusCodes.NOT_FOUND).json({message: 'Timeshare not found'});
}

module.exports = AuthorizeReview;