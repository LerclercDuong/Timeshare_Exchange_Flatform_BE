const axios = require('axios')
const {requestServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');


class RequestController {
    async RequestRent(req, res) {
        try {
            const {userId, postId, status, type} = req.body;
            const rentTimeshare = await requestServices.RequestRent(
                userId, 
                postId,
                status,
                type,
            );
            console.log(rentTimeshare),
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Request successful'
                },
                data: rentTimeshare
            })
        }
        catch (error) {
            console.error(error);
            res.status(StatusCodes.NO_CONTENT).json({
                status: {
                    code: res.statusCode,
                    message: 'Request Failed'
                },
                data: rentTimeshare
            });
        }
    }
}

module.exports = new RequestController;