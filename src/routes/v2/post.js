const express = require('express');
const router = express.Router();
const Post = require('../../controllers/v2/post.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.post('/post/:userId', Post.PostTimeshare); //dang bai viet
router.get('/list-timeshare', Post.GetAllTimeshare); //tat ca
router.get('/current-owner/:current_owner', Post.GetTimeshareByCurrentOwner); //Hien thi timeshare by Owner
router.delete('/:id/delete', Post.DeleteTimeshare); // xoa tam thoi
router.delete('/:id/force', Post.ForceDeleteTimeshare); //xoa vinh vien
router.put('/:id', Post.UpdateTimeshare); //cap nhat
router.patch('/:id/restore', Post.RestoreTimeshare); //khoi phuc
router.get('/:id/trash-list', Post.GetTimeShareByTrash); //danh sach timehshare trong thung rac
router.get('/post-timeshare', Post.PostTimeshare); //


// router.post('/', upload.single('image'), Post.Upload);
//--v2--//
router.get('/list-timeshare-availability', Post.PostTimeshare); //
router.get('/:id', Post.GetTimeshareById); //
router.post('/:postId/book', Post.SubmitRentRequest); //



router.post('/upload', upload.array('image'), Post.Upload);


module.exports = router;