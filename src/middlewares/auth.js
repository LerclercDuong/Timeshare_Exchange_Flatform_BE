const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/un-authenticated')
const moment = require("moment");
const { StatusCodes } = require('http-status-codes');
const { GetUserById } = require('../services/v2/user.service');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        //Token not found
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: 'JWT token not found'})
        }
        else {
            const token = authHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
            const userData = await GetUserById(payload.sub);
            req.user = {
                userId: payload.sub,
                data: userData,
            }
            next();
        }
    } catch {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are unauthorized to access this resource' })
    }
}


const AuthorizeAdmin = async (req, res, next) => {
    const user = req.user.data;
    if (user.role === 'admin') {
        next();
    }
    else res.status(StatusCodes.FORBIDDEN).json({message: 'Access forbidden'});
}
module.exports = auth;