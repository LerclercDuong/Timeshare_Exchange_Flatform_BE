const express = require('express');
const router = express.Router();
const UnitController = require('../../controllers/v2/unit.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });


module.exports = router;