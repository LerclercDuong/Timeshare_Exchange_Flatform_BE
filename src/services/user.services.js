const UserModel = require('../models/users');

class UserService {
    //create user
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
        return UserModel.find({}).select('_id username profilePicture role').lean();
    }
}

module.exports = new UserService;
