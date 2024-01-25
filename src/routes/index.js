const authRouter = require('./auth');
const userRouter = require('./user')
const timeshareRouter = require('./timeshare')
const propertyRouter = require('./property')

const CheckAuth = require('../middlewares/auth')
const multer  = require('multer')

// Set multer file storage folder
const upload = multer({ dest: 'uploads/' })

function router(app){
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter );
    app.use('/api/v1/timeshare', timeshareRouter);  
    app.use('/api/v1/property', propertyRouter);  

}

module.exports = router;