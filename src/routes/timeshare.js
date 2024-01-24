const express = require('express');
const router = express.Router();
const Timeshare = require('../api/timeshare');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.post('/post/:userId', Timeshare.PostTimeshare); //dang bai viet
router.get('/list-timeshare', Timeshare.GetAllTimeshare); //tat ca
router.get('/current-owner/:current_owner', Timeshare.GetTimeshareByCurrentOwner); //Hien thi timeshare by Owner
router.delete('/:id/delete', Timeshare.DeleteTimeshare); // xoa tam thoi
router.delete('/:id/force', Timeshare.ForceDeleteTimeshare); //xoa vinh vien
router.put('/:id', Timeshare.UpdateTimeshare); //cap nhat
router.patch('/:id/restore', Timeshare.RestoreTimeshare); //khoi phuc
router.get('/:id/trash-list', Timeshare.GetTimeShareByTrash); //danh sach timehshare trong thung rac
router.get('/post-timeshare', Timeshare.PostTimeshare); //
// router.post('/', upload.single('image'), Timeshare.Upload);

router.post('/upload', upload.array('image'), Timeshare.Upload);


module.exports = router;