const adminServices = require('../../services/v2/admin.service');
const postServices = require('../../services/v2/post.service');
const resortServices = require('../../services/v2/resort.service');
const { StatusCodes } = require('http-status-codes');
const { softDeleteAccount } = require('../../services/v2/admin.service');

class AdminController {
    // [GET] /
    // async AdminHomepage(req, res, next){
    //     //show res.render adminpage ---> admin dashboard
    // }
    
    // [GET] /account-list
    async GetAllAccounts(req, res, next){
        const allAccounts = await adminServices.getAllAccount();
        if(!allAccounts){
            res.status(StatusCodes.OK).json({
                status:{
                    code: res.statusCode,
                    message: 'Having no account'
                }
            })
            return;
        }
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Account found'
            }, 
            data: allAccounts
        })
    }
    
    //[GET] /ban-account/:id
    async BanAccount(req, res, next){
        adminServices.banAccount(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'ban success'
            }
        })
    }

    //[GET] /show-banned-accounts
    async ShowBannedAccount(req, res, next){
        const bannedAccounts = await adminServices.getAllBannedAccount();
        
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Show banned accounts success'
            },
            data: bannedAccounts
        })
    }

    //[GET] /unban-account/:id
    async unbanAccount(req, res, next){
        adminServices.unbanAccount(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'unban success'
            }
        })
    }

    //[GET] /force-delete-account/:id
    async ForceDeleteAccount(req, res, next){
        adminServices.forceDeleteAccount(req,params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'delete success'
            },
            data: null
        })
    }
    
    //[GET] /delete-account/:id
    async DeleteAccount(req, res, next){
        softDeleteAccount(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'delete success'
            },
            data: null
        })
    }

    //[GET] /restore-account/:id
    async RestoreAccount(req, res, next){
        adminServices.restoreAccount(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'restore success'
            },
            data: null
        })
    }

    //[GET] /deleted-account-list
    async ShowDeletedAccount(req, res, next){
        const allDeletedAccount = adminServices.getDeletedAccount();
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'Deleted account found'
            },
            data: allDeletedAccount
        })
    }

    //[GET] /post-list
    async GetAllPost(req, res, next){
        const allpost = await postServices.GetAllPosts();
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'Posts found'
            },
            data: allpost
        })
    }

    //[GET] /report-balance
    async ReportBalance(req, res, next){

    }

    //[GET] /request-list
    async ShowAllRequest(req, res, next){
        const allRequest = await adminServices.getAllRequest();
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'success find all request'
            },
            data: allRequest
        })
    }
    //[GET] /deny-request/:id
    async DenyRequest(req, res, next){
        adminServices.denyRequest(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'success deny request'
            },
            data: null
        })
    }
    //[GET] /pending-requests
    async ShowPendingRequest(req, res, next){
        const allPendingRequest = await adminServices.getAllPendingRequests();
        if(!allPendingRequest){
            res.status(StatusCodes.OK).json({
                status:{
                    code: res.statusCode,
                    message: 'Having no pending request'
                }
            })}
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Pending requests found'
            },
            data: allPendingRequest
        })
    }

    //[GET] /accept-request:/id
    async AcceptRequest(req, res, next){
        const id = req.params.id;
        adminServices.confirmARequest(id);
        res.status(StatusCodes.OK).json({
            status: {
                code: res.statusCode,
                message: 'Pending requests found'
            }
        })
    }
    
    //[GET] /resort-list
    async GetAllResort(req, res, next){
        const allResort = await resortServices.GetAll();
        if(!allResort){
            res.status(StatusCodes.OK).json({
                status:{
                    code: res.statusCode,
                    message: 'Having no resort'
                }
            })
            return;
        }
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'Resorts found'
            },
            data: allResort
        })
    }
}

module.exports = new AdminController;