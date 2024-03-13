const { StatusCodes } = require('http-status-codes');

const AuthorizeUser = async (req, res, next) => {
    const user = req.user.data;
    const requestUserId = req.params.userId;
    if (requestUserId === user._id || user.role === "admin") {
        next();
    }
    else res.status(StatusCodes.FORBIDDEN).json({message: 'Access forbidden'});
}

module.exports = AuthorizeUser;