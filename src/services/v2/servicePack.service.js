const ServicePackModel = require("../../models/servicePacks")
const TimeshareModel = require("../../models/timeshares")

class ServicePackService {
    async fetchAmountFormServicePack(req, res) {
        try {
            const amountData = await ServicePackModel.find();
            res.json( amountData  );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async CountUploadTimeshareByUser(userId, req, res) {
        const countUploadTimeshare = await TimeshareModel.countDocuments({ current_owner: userId});
        try {
            return countUploadTimeshare;
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
}

module.exports = new ServicePackService;
