const { adminServices } = require('../../services/v2');
const { postServices } = require('../../services/v2');
const { resortServices } = require('../../services/v2');
const { StatusCodes } = require('http-status-codes');

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
        try {
            const userId = req.user.userId;
            const targetId = req.params.id;
            if (userId == targetId) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "You cannot ban yourself"
                })
            }
            else {
                await adminServices.banAccount(targetId);
                res.status(StatusCodes.OK).json({
                    status:{
                        code: res.statusCode,
                        message: 'ban success'
                    }
                })
            }
        }
        catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
            })
        }
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
        await adminServices.unbanAccount(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'unban success'
            }
        })
    }

    //[GET] /force-delete-account/:id
    async ForceDeleteAccount(req, res, next){
        await adminServices.forceDeleteAccount(req.params.id);
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
        await adminServices.softDeleteAccount(req.params.id);
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'delete success '
            },
            data: req.params.id
        })
    }

    //[GET] /restore-account/:id
    async RestoreAccount(req, res, next){
        await adminServices.restoreAccount(req.params.id);
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
        const allDeletedAccount = await adminServices.getDeletedAccount();
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
    async CancelRequest(req, res, next){
        await adminServices.cancelRequest(req.params.id);
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
        await adminServices.confirmARequest(id);
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

    //[GET] /report-balance
    async ShowAllPayment(req, res, next){
        const allPayment = await adminServices.getAllPayment();
        res.status(StatusCodes.OK).json({
            status:{
                code: res.statusCode,
                message: 'Resorts found'
            },
            data: allPayment
        })
    }
}

module.exports = new AdminController;