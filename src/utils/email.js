const nodemailer = require("nodemailer");
const appPassword = 'deqovodjyfjvsacs';
module.exports =  nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "06122003anonymous@gmail.com",
        pass: appPassword,
    },
});