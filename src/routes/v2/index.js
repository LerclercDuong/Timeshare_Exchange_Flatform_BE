const authRouter = require('./auth');

const userRouter = require('./user');
const timeshareRouter = require('./timeshare');
const propertyRouter = require('./property');
const CheckAuth = require('../../middlewares/auth');
const multer  = require('multer')

// Set multer file storage folder
const upload = multer({ dest: 'uploads/' })

function router(app){
    app.use('/controllers/v2/auth', authRouter);
    app.use('/controllers/v2/user', userRouter );
    app.use('/controllers/v2/timeshare', timeshareRouter);
    app.use('/controllers/v2/property', propertyRouter);
}

module.exports = router;