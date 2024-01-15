const authRouter = require('./auth');
const userRouter = require('./user')
const CheckAuth = require('../middlewares/auth')

function router(app){
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', CheckAuth, userRouter );
}

module.exports = router;