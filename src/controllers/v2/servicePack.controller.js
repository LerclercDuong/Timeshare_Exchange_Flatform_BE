const axios = require('axios')
const {servicePackServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');


class ServicePackController {
    async CountUploadTimeshareByUser(req, res, next) {
        const {userId} = req.params;
        try {
            const servicePack = await servicePackServices.CountUploadTimeshareByUser(userId);
            if(servicePack){
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Trip found'
                    },
                    data: servicePack
                })
            }
        } catch(err) {
            console.log(err)
            res.status(StatusCodes.NO_CONTENT).json({
                status: {
                    code: res.statusCode,
                    message: 'Trip not found'
                },
                data: null
            })
        }
    }

}

module.exports = new ServicePackController;