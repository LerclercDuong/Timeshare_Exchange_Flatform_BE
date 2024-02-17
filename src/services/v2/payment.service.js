const bcrypt = require('bcrypt');
const moment = require("moment");
const UserId = require('../../controllers/v1/user');
const PostModel = require("../../models/posts");
const ReservationModel = require('../../models/reservations');
const RequestModel = require('../../models/requests')
const nodemailer = require("nodemailer");
const { uploadToS3 } = require("../../utils/s3Store");
const ResortModel = require("../../models/resorts");

class PaymentService {

}

module.exports = new PaymentService;