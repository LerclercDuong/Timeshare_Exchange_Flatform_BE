const authServices = require('./auth.service');
const userServices = require('./user.service');
const timeshareServices = require('./post.service');
const resortServices = require('./resort.service');
const requestServices = require('./request.service');
const reservationServices = require('./reservation.service')
const unitServices = require('./unit.service')
const postServices = require('./post.service')




module.exports = {
    authServices,
    userServices,
    timeshareServices,
    resortServices,
    requestServices,
    reservationServices,
    unitServices,
    postServices
}