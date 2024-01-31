const authRouter = require('./auth');

const userRouter = require('./user');
const postRouter = require('./post');
const resortRouter = require('./resort');
const CheckAuth = require('../../middlewares/auth');
const multer = require('multer')

// Set multer file storage folder
const upload = multer({dest: 'uploads/'})

function router(app) {
    app.use('/api/v2/auth', authRouter);
    app.use('/api/v2/user', userRouter);
    app.use('/api/v2/post', postRouter);
    app.use('/api/v2/resort', resortRouter);
}

module.exports = router;