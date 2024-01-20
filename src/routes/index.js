const authRouter = require('./auth');

const userRouter = require('./user')
const timeshareRouter = require('./timeshare')
const CheckAuth = require('../middlewares/auth')

function router(app){
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter );
    app.use('/api/v1/timeshare', timeshareRouter);
}

module.exports = router;