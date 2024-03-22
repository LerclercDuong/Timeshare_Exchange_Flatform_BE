const { userServices }  = require('../../services/v2');
const {StatusCodes} = require('http-status-codes');
const query = require("../../utils/query");
const {resortServices} = require("../../services/v2");
const user = require('../v1/user');

class UserController {
    async GetUsers(req, res, next){
        const filter = query(req.query, ['username', 'role']);
        const options = {
            ...query(req.query, ['page']),
            sort: { username: -1 } // Sorting by timestamp in descending order
        };
        const results = await userServices.QueryUser(filter, options);
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Query User'
            },
            data: results
        })
    }

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

    async UpdateUser(req, res, next){
        try {
            const { userId } = req.params;
            const userEmail = await userServices.GetUserByEmail(req.body.email)
            //If there is a user register that email, abort the update
            if (userEmail && userEmail._id.toString() !== userId) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Email already registered by other user!',
                })
            }
            else {
                const updated = await userServices.UpdateUser(userId, req.body, req.files);
                if (updated) {
                    res.status(StatusCodes.OK).json({
                        status: {
                            code: res.statusCode,
                            message: 'Update user successfully'
                        },
                        data: updated
                    })
                }
                else res.status(StatusCodes.NO_CONTENT).json({
                    status: {
                        code: res.statusCode,
                        message: 'Update user failed'
                    },
                    data: null
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })
        }
    }

    async UpgradeUser(req, res,next ){

    }
    async ChangePassword(req, res, next) {
        try {
            const {oldPassword, newPassword} = req.body;
            await userServices.ChangePassword(req.user.userId, oldPassword, newPassword);
            res.status(StatusCodes.OK).json({message: "Change password successfully"})
        }
        catch (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: err.message});
        }
    }
}

module.exports = new UserController;