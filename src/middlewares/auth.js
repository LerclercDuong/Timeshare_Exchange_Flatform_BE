const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/un-authenticated')
const moment = require("moment");
const { StatusCodes } = require('http-status-codes');
const { GetUserById } = require('../services/v2/user.service');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new Error('JWT token not found');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
        req.user = {
            userId: payload.sub
        }
        next();
    } catch {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are unauthorized to access this resource' })
    }
}

// Authorization middleware
const authorizeAdmin = async (req, res, next) => {
    const user = await GetUserById(req.user);
    if (user.role === 'admin') {
        next();
    }
    else res.status(403).send('Access forbidden');
}
module.exports = auth;