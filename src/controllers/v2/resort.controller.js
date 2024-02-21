const axios = require('axios')
const {resortServices} = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');
const query = require('../../utils/query')

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
        const allResorts = await resortServices.GetAll();
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Resort found'
            },
            data: allResorts
        })
    }

    async UpdateResort(req, res, next){
        const resortId = req.params.id;
        const updateField = req.body;
        const updated = await resortServices.UpdateResort(resortId, updateField);
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Update resort'
            },
            data: updated
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

}

module.exports = new ResortController;