const express = require('express');
const router = express.Router();
const Timeshare = require('../api/timeshare');

router.post('/post/:userId', Timeshare.PostTimeshare);
router.get('/list-timeshare', Timeshare.GetAllTimeshare);
router.get('/current-owner/:current_owner', Timeshare.GetTimesharerByCurrentOwner);

module.exports = router;