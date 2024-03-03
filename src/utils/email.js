// const nodemailer = require("nodemailer");
// const appPassword = 'deqovodjyfjvsacs';
// module.exports =  nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: "06122003anonymous@gmail.com",
//         pass: appPassword,
//     },
// });

const nodemailer = require("nodemailer");
const appPassword = 'xifh posa jkdz megj';
module.exports =  nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "doantri2003@gmail.com",
        pass: appPassword,
    },
});

