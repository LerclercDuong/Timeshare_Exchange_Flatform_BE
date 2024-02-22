const authRouter = require('./auth');
const userRouter = require('./user');
const postRouter = require('./post');
const resortRouter = require('./resort');
const requestRouter = require('./request')
const paymentRouter = require('./payment')
const reservationRouter = require('./reservation')
const unitRouter = require('./unit')
const tripRouter = require('./trip')
const CheckAuth = require('../../middlewares/auth');
const multer = require('multer')

// Set multer file storage folder
const upload = multer({dest: 'uploads/'})

function router(app) {
    app.use('/api/v2/auth', authRouter);
    app.use('/api/v2/user', userRouter );
    app.use('/api/v2/post', postRouter);
    app.use('/api/v2/resort', resortRouter);
    app.use('/api/v2/request', requestRouter);
    app.use('/api/v2/reservation', reservationRouter);
    app.use('/api/v2/unit', unitRouter);
    app.use('/api/v2/payment', paymentRouter);
    app.use('/api/v2/trip', tripRouter);
}

module.exports = router;