const express = require('express');
const router = express.Router();
const resortController = require('../../controllers/v2/resort.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/'});

router.get('/of/', resortController.GetResort);


module.exports = router;