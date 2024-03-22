const UserModel = require('../../models/users');
const ResortModel = require("../../models/resorts");
const s3Utils = require("../../utils/s3Store");
const checkLogin = require('../../utils/checkLogin');

class UserService {
    async QueryUser(filter, options) {
        return await UserModel.paginate(filter, options);
    }

    async GetUserById(userId) {
        try {
            const user = await UserModel.findById(userId).select('_id firstname lastname username email emailVerified phone profilePicture role').lean();
            return user;
        } catch (err) {
            throw err;
        }
    }

    async GetUserByName(username) {
        try {
            const user = await UserModel.findOne({username: username}).lean();
            return user;
        } catch (err) {
            return null;
        }
    }

    async GetUserByEmail(email) {
        try {
            const user = await UserModel.findOne({email: email}).select('_id username profilePicture role').lean();
            return user;
        }
        catch (err) {
            return null;
        }
    }

    async GetUsers() {
        return UserModel.find({}).select('_id username profilePicture role phone').lean();
    }

    async UpdateUser(userId, updatedData, image) {
        const file = image?.profilePicture;
        var data = {
            ...updatedData,
        }
        if (file) {
            const {key} = await s3Utils.uploadToS3({userId, file});
            data = {
                ...updatedData,
                profilePicture: key
            }
        }
        const checkUser = await UserModel.findById(userId);
        // If the email is updated, reset the verify state
        if (checkUser.email !== data.email) {
            data.emailVerified = false;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {$set: data},
            {new: true} // Return the updated document
        );
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    /**
     * Update email verification status for user
     * @param {*} userId 
     */
    async UpdateEmailStatus(userId) {
        try {
            await UserModel.findOneAndUpdate(
                {_id: userId},
                {emailVerified: true}
            )
        }
        catch (err) {
            throw err;
        }
    }

    async ResetPassword(userId, newPassword) {
        try {
            const update = {
                password: newPassword,
            }
            await UserModel.findOneAndUpdate(
                {_id: userId},
                update,
            )
        }
        catch (err) {
            throw err;
        }
    }
    async ChangePassword(userId, oldPassword, newPassword) {
        try {
            const userData = await this.GetUserById(userId);
            if (await checkLogin(userData.username, oldPassword)) {
                await this.ResetPassword(userId, newPassword);
            }
            else throw Error('Wrong password');
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = new UserService;
