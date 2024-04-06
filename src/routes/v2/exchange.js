const express = require('express');
const router = express.Router();
const exchangeRouter = require('../../controllers/v2/exchange.controller');
const multer = require('multer');

router.post('/:timeshareId', exchangeRouter.MakeExchange);
router.patch('/:exchangeId/accept', exchangeRouter.ConfirmExchange);
router.patch('/:exchangeId/cancel', exchangeRouter.CancelExchange);

router.get('/of-post/:timeshareId', exchangeRouter.GetExchangeRequestOfTimeshare);
router.get('/:exchangeId', exchangeRouter.GetExchangeById);
router.get('/of-user/:userId', exchangeRouter.GetExchangeOfUser)
router.put('/canceled/:exchangeId', exchangeRouter.CancelMyExchangeRequest);
router.delete('/:exchangeId', exchangeRouter.DeleteMyExchangeRequest);
router.get('/get-all/exchange', exchangeRouter.GetAllExchange);

module.exports = router;