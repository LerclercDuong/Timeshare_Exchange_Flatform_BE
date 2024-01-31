const UserModel = require('../../models/users');
const ResortModel = require("../../models/resorts");

class UserService {
    async QueryUser(filter, options){
        return await UserModel.paginate(filter, options);
    }

    async GetUserById(userId) {
        return UserModel.findById(userId).select('_id username profilePicture role').lean();
    }

    async GetUserByName(username){
        return UserModel.findOne({username: username}).select('_id username profilePicture role').lean();
    }

    async GetUserByEmail(email){
        return UserModel.findOne({email: email}).select('_id username profilePicture role').lean();
    }

    async GetUsers(){
        return UserModel.find({}).select('_id username profilePicture role phone').lean();
    }
}

module.exports = new UserService;
