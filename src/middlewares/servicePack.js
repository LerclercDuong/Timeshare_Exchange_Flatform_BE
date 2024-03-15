const ServicePackModel = require("../models/servicePacks");
const TimeshareModel = require("../models/timeshares");
const UserModel = require("../models/users");

const CountUploadTimeshareByUser = async (req, res, next) => {
    try {
        const current_owner = req.user.data;
        const countUploadTimeshare = await TimeshareModel.countDocuments({ current_owner: current_owner });
        const Timeshare = await TimeshareModel.findOne({ current_owner: current_owner })
        const servicePackId = Timeshare?.current_owner?.servicePack;

        const servicePack = await ServicePackModel.findById(servicePackId);

        console.log(countUploadTimeshare);
        console.log(servicePack?.numberPosts);

        if (!servicePack || countUploadTimeshare >= servicePack.numberPosts) {
            console.log("Exceeded number of allowed posts.");
            return res.status(403).json({ error: 'Exceeded number of allowed posts' });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = CountUploadTimeshareByUser;
