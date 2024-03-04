const express = require('express');
const router = express.Router();
const Admin = require('../../controllers/v2/admin.controller');

//Account Management
router.get('/ban-account/:id', Admin.BanAccount);
router.get('/unban-account/:id', Admin.unbanAccount);
router.get('/show-banned-accounts', Admin.ShowBannedAccount);
router.get('/account-list', Admin.GetAllAccounts);
router.get('/delete-account/:id', Admin.DeleteAccount);
router.get('/restore-account/:id', Admin.RestoreAccount);
router.get('/deleted-account-list', Admin.ShowDeletedAccount);


//Post management
router.get('/post-list', Admin.GetAllPost);

//Request management
router.get('/accept-request/:id', Admin.AcceptRequest);
router.get('/pending-request', Admin.ShowPendingRequest);
router.get('/deny-request/:id', Admin.DenyRequest);
router.get('/request-list', Admin.ShowAllRequest);

//Resort management
router.get('/resort-list', Admin.GetAllResort);

//Admin homepage
// router.get('/', Admin.AdminHomepage);

module.exports = router;