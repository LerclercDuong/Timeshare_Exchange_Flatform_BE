const { StatusCodes } = require('http-status-codes');
const { GetPostById } = require("../services/v2/timeshare.service");


const AuthorizeTimeshare = async (req, res, next) => {
    const user = req.user.data;
    const timeshare = GetPostById(req.params.id);
    if (timeshare) {
        if (user.role === 'admin' || timeshare.current_owner === user._id) {
            req.timeshare = {
                data: timeshare,
            }
            next();
        }
        else res.status(StatusCodes.FORBIDDEN).json({message: 'Access forbidden'});
    }
    else res.status(StatusCodes.NOT_FOUND).json({message: 'Timeshare not found'});
}

module.exports = AuthorizeTimeshare;