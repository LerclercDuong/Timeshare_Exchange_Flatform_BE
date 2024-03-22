const ServicePackModel = require("../models/servicePacks");
const TimeshareModel = require("../models/timeshares");
const UserModel = require("../models/users");

const CountUploadTimeshareByUser = async (req, res, next) => {
        
    try {
        const current_owner = req.user.data;
        const countUploadTimeshare = await TimeshareModel.countDocuments({ current_owner: current_owner });
        const User = await UserModel.findOne({ _id: current_owner})
        const servicePackId = User?.servicePack;
    
        const servicePack = await ServicePackModel.findById(servicePackId);
    
        console.log(User);
        console.log(servicePack?.numberPosts);
    
        // Kiểm tra nếu servicePack?.numberPosts là null thì gán bằng 0
        const numberOfPostsAllowed = (servicePack && servicePack.numberPosts) ? servicePack.numberPosts : 0;
    
        if (!servicePack || countUploadTimeshare >= numberOfPostsAllowed) {
            console.log("Exceeded number of allowed posts.");
            return res.status(403).json({ message: 'Exceeded number of allowed posts' });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
    
}

module.exports = CountUploadTimeshareByUser;
