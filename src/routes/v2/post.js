const express = require('express');
const router = express.Router();
const postController = require('../../controllers/v2/post.controller');
const multer = require('multer');
const upload = multer({ dest: 'src/public/img/' });

router.post('/post/:userId', postController.PostTimeshare); //dang bai viet
router.get('/list-timeshare', postController.GetAllPosts); //tat ca
router.get('/current-owner/:current_owner', postController.GetTimeshareByCurrentOwner); //Hien thi timeshare by Owner
router.delete('/:id/delete', postController.DeleteTimeshare); // xoa tam thoi
router.delete('/:id/force', postController.ForceDeleteTimeshare); //xoa vinh vien
router.put('/:id', postController.UpdateTimeshare); //cap nhat
router.patch('/:id/restore', postController.RestoreTimeshare); //khoi phuc
router.get('/:id/trash-list', postController.GetTimeShareByTrash); //danh sach timehshare trong thung rac
router.get('/post-timeshare', postController.PostTimeshare); //
// router.post('/', upload.single('image'), Post.Upload);

router.post('/upload', upload.array('image'), postController.Upload);


module.exports = router;