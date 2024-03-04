const nodemailer = require("nodemailer");
const appPassword = 'qdmoyjatnlvgamos';
module.exports =  nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "contact.us.nicetrip@gmail.com",
        pass: appPassword,
    },
});