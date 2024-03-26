const axios = require('axios')
const { resortServices } = require('../../services/v2');
const { StatusCodes } = require('http-status-codes');
const { query } = require('../../utils/query');
const { GetTimeshareByUnitId } = require('../../services/v2/timeshare.service');
const { DeleteResort, RestoreResort } = require('../../services/v2/resort.service');


class ResortController {
    /**
     * Retrieves resorts based on specified filters and options.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} - A Promise representing the asynchronous operation.
     *
     * @remarks
     * This function uses the `QueryResort` method from `resortServices` to query resorts.
     * The filters include 'name', 'location', 'description', 'facilities', and 'nearby_attractions'.
     * The options include 'page' for pagination.
     *
     * Example Usage:
     * ```
     * GET /resort/get?name=example&location=city&page=1
     * ```
     */
    async GetResort(req, res, next) {
        const filter = query(req.query, ['name', 'location', 'description', 'facilities', 'nearby_attractions']);
        const options = query(req.query, ['page']);
        const results = await resortServices.QueryResort(filter, options);
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Query resort'
            },
            data: results
        })
    }
    /**
     * Retrieves a resort by its unique identifier.
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {Promise<void>} - A Promise representing the asynchronous operation.
     *
     * @remarks
     * This function uses the `GetById` method from `resortServices` to retrieve a resort by ID.
     * The resort ID is obtained from the request parameters.
     *
     * Example Usage:
     * ```
     * GET /resort/:id
     * ```
     */
    async GetResortById(req, res, next) {
        try {
            const resortId = req.params.id;
            const resort = await resortServices.GetById(resortId);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Resort found'
                },
                data: resort
            })
        } catch (err) {
            res.json({
                status: {
                    code: res.statusCode,
                    message: 'Resort not found'
                },
            })
        }
    }

    async GetAllResorts(req, res, next) {
        const filter = query(req.query, ['name'])
        const options = query(req.query, ['page'])
        const allResorts = await resortServices.QueryResort(filter, options);
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Resort found'
            },
            data: allResorts
        })
    }
    async GetActiveResorts(req, res, next) {
        const allResorts = await resortServices.GetActiveResorts();
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Resort found'
            },
            data: allResorts
        })
    }

    async GetAllPostByResortId(req, res, next) {
        const { id } = req.params;
        try {
            const allPosts = await resortServices.GetAllPostByResortId(id);
            res.status(StatusCodes.OK).json({
                status: {
                    code: res.statusCode,
                    message: 'Get all post by resort id'
                },
                data: allPosts
            });
        } catch (error) {
            res.json({
                status: {
                    code: res.statusCode,
                    message: 'Resort id not found'
                },
            })
        }
    }
    async UploadResort(req, res, next) {
        try {
            const userId = req.user.userId;
            const { name, description, location, facilities, attractions, policies, units } = req.body;
            const { images, unitImages } = req.files;
            console.log(unitImages);
            // Convert the string to an array of objects
            const unitsArray = JSON.parse(units);
            const resortData = await resortServices.UploadResortWithS3({
                name,
                description,
                location,
                facilities,
                attractions,
                policies,
                images,
                userId
            })
            //console.log(resortData);
            // If the resort is saved, upload units
            if (resortData && resortData._id) {
                unitsArray.forEach(async (unit, index) => {
                    const resortId = resortData._id;
                    let image;
                    if (!Array.isArray(unitImages)) {
                        image = unitImages;
                    }
                    else image = unitImages[index];
                    const { name, roomType, kitchenType, sleeps, bathrooms, features } = unit;

                    // UPLOAD UNITS
                    const unitData = await unitService.UploadUnitWithS3({
                        name,
                        roomType,
                        kitchenType,
                        sleeps,
                        bathrooms,
                        image,
                        features,
                        resortId,
                        userId,
                    })
                    console.log(unitData)
                    if (unitData) {
                        await resortServices.AddUnit(resortId, unitData._id);
                    }
                })
            }
            res.status(StatusCodes.CREATED).json({
                status: {
                    code: res.statusCode,
                    message: 'Uploaded successful'
                },
                data: null
            });
        }
        catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: err.message
            });
        }
    }
    async UpdateResort(req, res, next) {
        try {
            console.log(req.body);
            console.log(req.files);
            const userId = req.user.userId
            const result = await resortServices.UpdateResortPartial(req.params.id, req.files?.images, req.body, userId)
            if (result) {
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Update successful'
                    },
                    data: null
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }

    }
    async DeleteResort(req, res, next) {
        try {
            const resortId = req.params.id;
            const resort = await resortServices.GetById(resortId);
            let hasActiveTimeshare = false;
            resort.units.forEach(async unitId => {
                const timeshare = await GetTimeshareByUnitId(unitId);
                console.log(timeshare);
                if (timeshare.start_date > Date.now()) {
                    res.status(StatusCodes.BAD_REQUEST).json({
                        message: "This resort already have active timeshares, delete all active timeshare and try again"
                    })
                    hasActiveTimeshare = true;
                }
            });
            //If the resort has no active timeshare then its safe to delete
            if (!hasActiveTimeshare) {
                const data = await DeleteResort(resortId)
                res.status(StatusCodes.NO_CONTENT).json({
                    status: {
                        code: res.statusCode,
                        message: 'Deleted'
                    },
                    data: data
                })
            }
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
    async RestoreResort(req, res, next) {
        try {
            const resortId = req.params.id;
            const resort = await resortServices.GetById(resortId);
            const data = await RestoreResort(resortId)
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: 'Restored'
                    },
                    data: data
                })
        }
        catch (error) {
            console.log(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message
            })
        }
    }
}

module.exports = new ResortController;