const nodemailer = require("nodemailer");
const appPassword = 'fiib vxuw eaqk auir';
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