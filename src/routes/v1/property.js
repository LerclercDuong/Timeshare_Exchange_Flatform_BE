const express = require('express');
const router = express.Router();
const Property = require('../../controllers/v1/property');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.get('/search', Property.SearchProperty); 

module.exports = router;