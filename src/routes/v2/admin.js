const express = require('express');
const router = express.Router();
const Admin = require('../../controllers/v2/admin.controller');

//Account Management
router.get('/ban-account/:id', Admin.BanAccount);//checked
router.get('/unban-account/:id', Admin.unbanAccount);//checked
router.get('/show-banned-accounts', Admin.ShowBannedAccount);//checked
router.get('/account-list', Admin.GetAllAccounts);//checked
router.get('/delete-account/:id', Admin.DeleteAccount);//checked
router.get('/restore-account/:id', Admin.RestoreAccount);//checked
router.get('/deleted-account-list', Admin.ShowDeletedAccount);//
router.get('/force-delete-account/:id', Admin.ForceDeleteAccount);


//Post management
router.get('/post-list', Admin.GetAllPost);//checked

//Request management
router.get('/accept-request/:id', Admin.AcceptRequest);//checked
router.get('/pending-request', Admin.ShowPendingRequest);//checked
router.get('/cancel-request/:id', Admin.CancelRequest);
router.get('/request-list', Admin.ShowAllRequest);

//Resort management
router.get('/resort-list', Admin.GetAllResort);

//Payment management

//Admin homepage
// router.get('/', Admin.AdminHomepage);

module.exports = router;