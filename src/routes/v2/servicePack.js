const express = require('express');
const router = express.Router();
const servicePackService = require('../../services/v2/servicePack.service');
const servicePackController = require('../../controllers/v2/servicePack.controller');
const servicePackMiddlewares = require('../../middlewares/servicePack');


router.get('/getAllServicePack', servicePackService.fetchAmountFormServicePack);
router.get('/:userId', servicePackController.CountUploadTimeshareByUser);

module.exports = router;