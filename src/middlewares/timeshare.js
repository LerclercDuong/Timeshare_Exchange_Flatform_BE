const { StatusCodes } = require('http-status-codes');
const { GetPostById } = require("../services/v2/timeshare.service");


const AuthorizeTimeshare = async (req, res, next) => {
    const user = req.user.data;
    const timeshare = await GetPostById(req.params.id);
    //Check if timeshare found
    if (timeshare) {
        //Check if the user has admin role or the timeshare owner
        if (user.role === 'admin' || timeshare.current_owner._id.toString() === user._id.toString()) {
            //Append requested timeshare data for further use
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