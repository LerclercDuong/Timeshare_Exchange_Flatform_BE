const ReviewModel = require("../../models/reviews");
class ReviewService {
    async CreateReview({userId, resortId, star, description}) {
        const data = {
            userId: userId,
            resortId: resortId,
            star: star,
            description: description,
        }
        const review = new ReviewModel({...data});
        return review.save().catch();
    }
    async GetReviewById(id) {
        return ReviewModel.findById(id).populate({
            path: 'userId',
            select: '_id username profilePicture'
        });
    }
    async GetReviewByResortId(resortId) {
        return ReviewModel
            .find({resortId: resortId})
            .populate({
                path: 'userId',
                select: '_id username profilePicture'
            })
            .sort({ timestamp: -1 })
            .lean();
    }
    async DeleteReview(reviewId) {
        const deleteTimeshare = await ReviewModel.deleteOne({_id: reviewId})
        return deleteTimeshare;
    }
    async ForceDeleteReview(reviewId) {
        const forceDeleteTimeshare = await ReviewModel.deleteOne({_id: reviewId})
        return forceDeleteTimeshare;
    }
}

module.exports = new ReviewService;