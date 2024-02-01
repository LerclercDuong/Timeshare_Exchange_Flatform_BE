const express = require('express');
const router = express.Router();
const requestRouter = require('../../controllers/v2/request.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.post('/rent', requestRouter.RequestRent);

// router.get('/exchange', requestRouter.a);


module.exports = router;