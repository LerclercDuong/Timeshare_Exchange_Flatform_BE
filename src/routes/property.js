const express = require('express');
const router = express.Router();
const Property = require('../api/property');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.get('/list-all', Property.GetAllProperties); //
// router.get('/stored', Property.stored);

router.post('/post', Property.PostProperty); //
// // router.post('/', upload.single('image'), Timeshare.Upload);


module.exports = router;