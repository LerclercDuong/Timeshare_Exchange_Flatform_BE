const express = require('express');
const { StatusCodes } = require('http-status-codes');
const {reviewServices, resortServices} = require('../../services/v2');

class Reviews {
    async GetReviewByResortId(req, res, next) {
        const resortId = req.params.resortId;
        try {
            const reviewData = await reviewServices.GetReviewByResortId(resortId);
            if (reviewData) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Review found'
                    },
                    data: reviewData
                })
            }
            else res.status(StatusCodes.NOT_FOUND).json({
                message: 'Review not found',
            })
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
            })
        }
    }
    async CreateReview(req, res, next) {
        try {
            const {resortId, star, description} = req.body;
            if (resortId && resortServices.GetById(resortId)) {
                const data = await reviewServices.CreateReview({
                    userId: req.user.userId, 
                    resortId: resortId,
                    star: star,
                    description: description,
                })
                res.status(StatusCodes.CREATED).json({
                    data: data,
                })
            }
            else res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Resort not found',
            })
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
            })
        }
    }
}

module.exports = new Reviews;