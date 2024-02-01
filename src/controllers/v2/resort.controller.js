const axios = require('axios')
const {resortServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');

class ResortController {
    async GetResortById(req, res, next) {
        try {
            const resortId = req.params.id;
            const resort = await resortServices.GetById(resortId);
            res.status(StatusCodes.OK).json({
                statusCode: res.statusCode,
                message: "Resort found",
                data: resort
            })
        } catch (err) {
            res.json({
                statusCode: err.statusCode,
                message: "Resort not found",
            })
        }
    }
    
    async GetAllResorts(req, res, next) {
        const allResorts = await resortServices.GetAll();
        res.status(StatusCodes.OK).json({
            statusCode: res.statusCode,
            message: "Resort found",
            data: allResorts
        })
    }

    async GetAllPostByResortId(req, res, next) {
        const { id } = req.params;
        try {
            const allPosts = await resortServices.GetAllPostByResortId(id);
            res.status(StatusCodes.OK).json(allPosts);
        } catch (error) {
            next(error);
        }
    }
    
    
}

module.exports = new ResortController;