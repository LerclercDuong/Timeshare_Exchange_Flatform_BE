const UserModel = require('../../models/users');
const ResortModel = require("../../models/resorts");
const s3Utils = require("../../utils/s3Store")

class UserService {
    async QueryUser(filter, options) {
        return await UserModel.paginate(filter, options);
    }

    async GetUserById(userId) {
        try {
            const user = await UserModel.findById(userId).select('_id firstname lastname username email phone profilePicture role').lean();
            if (user) {
                if (!user.profilePicture) {
                    return {...user, profilePicture: ''};
                }
                if ((user.profilePicture).startsWith(user._id)) {
                    const presignedUrl = await s3Utils.GetPresignedUrl(user.profilePicture);
                    return {...user, profilePicture: presignedUrl};
                }
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async GetUserByName(username) {
        try {
            const user = await UserModel.findOne({username: username}).lean();
            if (user) {
                if (!user.profilePicture) {
                    return {...user, profilePicture: ''};
                }
                if ((user.profilePicture).startsWith(user._id)) {
                    const presignedUrl = await s3Utils.GetPresignedUrl(user.profilePicture);
                    return {...user, profilePicture: presignedUrl};
                }
            }
            return user;
        } catch (err) {
            throw err;
        }
    }

    async GetUserByEmail(email) {
        return UserModel.findOne({email: email}).select('_id username profilePicture role').lean();
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
}

module.exports = new UserService;
