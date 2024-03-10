const express = require('express');
const router = express.Router();
const Admin = require('../../controllers/v2/admin.controller');

//Account Management
router.get('/ban-account/:id', Admin.BanAccount);
router.get('/unban-account/:id', Admin.unbanAccount);
router.get('/show-banned-accounts', Admin.ShowBannedAccount);
router.get('/account-list', Admin.GetAllAccounts);
router.delete('/delete-account/:id', Admin.DeleteAccount);
router.get('/restore-account/:id', Admin.RestoreAccount);
router.get('/deleted-account-list', Admin.ShowDeletedAccount);
router.delete('/force-delete-account/:id', Admin.ForceDeleteAccount);


//Post management
// router.get('/post-list', Admin.GetAllPost);

//Request management
router.get('/accept-request/:id', Admin.AcceptRequest);
router.get('/pending-request', Admin.ShowPendingRequest);
router.get('/cancel-request/:id', Admin.CancelRequest);
router.get('/request-list', Admin.ShowAllRequest);

//Resort management
router.get('/resort-list', Admin.GetAllResort);

//Report balance
router.get('/report-balance', Admin.ShowAllPayment);

module.exports = router;