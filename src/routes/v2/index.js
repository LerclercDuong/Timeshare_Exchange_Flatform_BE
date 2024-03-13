const authRouter = require('./auth');
const userRouter = require('./user');
const timeshareRouter = require('./timeshare');
const resortRouter = require('./resort');
const requestRouter = require('./request')
const paymentRouter = require('./payment')
const reservationRouter = require('./reservation')
const unitRouter = require('./unit')
const adminRouter = require('./admin');
const emailRouter = require('./email')
const tripRouter = require('./trip')
const exchangeRouter = require('./exchange')
const reviewRouter = require('./review')
const chatRouter = require('./chat')
const CheckAuth = require('../../middlewares/auth');
const multer = require('multer')
const servicePackRouter = require('./servicePack')
const upload = multer({dest: 'uploads/'})

function router(app) {
    app.use('/api/v2/auth', authRouter);
    app.use('/api/v2/admin', adminRouter);
    app.use('/api/v2/user', userRouter );
    app.use('/api/v2/timeshare', timeshareRouter);
    app.use('/api/v2/resort', resortRouter);
    app.use('/api/v2/request', requestRouter);
    app.use('/api/v2/reservation', reservationRouter);
    app.use('/api/v2/unit', unitRouter);
    app.use('/api/v2/payment', paymentRouter);
    app.use('/api/v2/email', emailRouter);
    app.use('/api/v2/trip', tripRouter);
    app.use('/api/v2/exchange', exchangeRouter);
    app.use('/api/v2/servicePack', servicePackRouter);
    app.use('/api/v2/review', reviewRouter);
    app.use('/api/v2/chat', chatRouter);
}

module.exports = router;