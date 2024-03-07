const express = require('express');
const router = express.Router();
const exchangeRouter = require('../../controllers/v2/exchange.controller');
const multer = require('multer');

router.post('/:timeshareId', exchangeRouter.MakeExchange);
router.patch('/:exchangeId/accept', exchangeRouter.ConfirmExchange);
router.patch('/:exchangeId/cancel', exchangeRouter.CancelExchange);

router.get('/of-post/:timeshareId', exchangeRouter.GetExchangeRequestOfTimeshare);
router.get('/:exchangeId', exchangeRouter.GetExchangeById);


module.exports = router;