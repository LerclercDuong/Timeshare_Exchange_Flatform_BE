const userService = require('../services/user.services.js');
const {StatusCodes} = require('http-status-codes');
class User {

    async GetAllUsers(req, res, next) {
        try{
            const userList = await userService.GetUsers();
            res.status(StatusCodes.OK).json(userList)
        }
        catch{
            res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
        }
    }

    async GetUserById(req, res, next) {
        const { userId } = req.params;
        const userData = await userService.GetUserById(userId);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
    }

    async GetUserByUsername(req, res, next) {
        const { username } = req.params;
        const userData = await userService.GetUserByName(username);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'User not found'})
    }

    
}

module.exports = new User;