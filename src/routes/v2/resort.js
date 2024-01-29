const express = require('express');
const router = express.Router();
const resortController = require('../../controllers/v2/resort.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.get('/get-all', resortController.GetAllResorts);
router.get('/:id', resortController.GetResortById);


module.exports = router;