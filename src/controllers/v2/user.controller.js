const { userServices }  = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');
class UserController {

    async GetAllUsers(req, res, next) {
        try{
            const userList = await userServices.GetUsers();
            res.status(StatusCodes.OK).json(userList)
        }
        catch{
            res.status(StatusCodes.NO_CONTENT).json({message: 'UserController not found'})
        }
    }

    async GetUserById(req, res, next) {
        const { userId } = req.params;
        const userData = await userServices.GetUserById(userId);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'UserController not found'})
    }

    async GetUserByUsername(req, res, next) {
        const { username } = req.params;
        const userData = await userServices.GetUserByName(username);
        if (userData) {
            res.status(StatusCodes.OK).json(userData)
            return;
        }
        res.status(StatusCodes.NO_CONTENT).json({message: 'UserController not found'})
    }
    
}

module.exports = new UserController;