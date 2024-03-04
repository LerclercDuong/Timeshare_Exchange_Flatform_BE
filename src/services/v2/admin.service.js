const UserModel = require('../../models/users');
const RequestModel = require('../../models/requests');
const {StatusCodes} = require('http-status-codes');
const query = require('../../utils/query')

class AdminService {
    //request management
    async getAllRequest(){
        try{
            return RequestModel.find({});
        } catch (error) {
            throw new Error(`Error find request: ${error.message}`);
        }
    }

    async getAllPendingRequests(){
        try{
            return RequestModel.find({ status: 'pending' });
        } catch (error) {
            throw new Error(`Error find pending request: ${error.message}`);
        }
    }

    async confirmARequest(id){
        try {
            return RequestModel.updateOne({ _id: id }, { status: 'confirmed' });
        } catch (error) {
            throw new Error(`Error confirm request: ${error.message}`);
        }
    }

    async denyRequest(id){
        try {
            return RequestModel.updateOne({ _id: id }, { status: 'canceled' });
        } catch (error) {
            throw new Error(`Error confirm request: ${error.message}`);
        }
    }

    //Account management
    async banAccount(id){
        try {
            return UserModel.updateOne({ _id: id }, {isBanned: true});
        } catch (error) {
            throw new Error(`Error ban account: ${error.message}`);
        }
    }
    async getAllBannedAccount(){
        try {
            return UserModel.find({isBanned: true});
        } catch (error) {
            throw new Error(`Error show ban account: ${error.message}`);
        }
    }
    async unbanAccount(id){
        try {
            return UserModel.updateOne({ _id: id }, {isBanned: false});
        } catch (error) {
            throw new Error(`Error ban account: ${error.message}`);
        }
    }
    async softDeleteAccount(id) {
        try {
            return UserModel.UpdateOne({_id: id}, { isDeleted: true });
        } catch (error) {
            console.error('Error soft deleting user:', error);
        }
    }
    async forceDeleteAccount(id){
        try {
            return UserModel.deleteOne({_id: id});
            
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
    async getDeletedAccount(){
        try {
            return UserModel.find({isBanned: false});
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
    async restoreAccount(id){
        try {
            return UserModel.UpdateOne({_id: id}, { isDeleted: false });
        } catch (error) {
            console.error('Error restore user:', error);
        }
    }

    async getAllAccount(){
        try{
            return UserModel.find({isDeleted: false});
        }catch(err){
            throw new Error(`Error in get account: ${error.message}`);
        }
        
    }
    async getAllUserAccount(){
        return UserModel.find({ role: user }, {isDeleted: false});
    }
    async getAllMemberAccount(){
        return UserModel.find({ role: member }, {isDeleted: false});
    }
    async getNotAdminAccount(){
        return UserModel.find({ role : { $ne:'admin' } }, {isDeleted: false});
    }
}

module.exports = new AdminService;
