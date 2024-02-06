const UserModel = require('../../models/users');
const ResortModel = require("../../models/resorts");
const nodemailer = require("nodemailer");
const appPassword = 'zvpg rhqd qcfg tszn';
const transporter = nodemailer.createTransport({
       service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
    auth: {
      user: "bwfnguyenvu@gmail.com",
      pass: appPassword,
    },
});

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
