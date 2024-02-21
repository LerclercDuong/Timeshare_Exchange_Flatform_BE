const nodemailer = require("nodemailer");
const appPassword = 'qpndxlavijdssztn';
export default nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "doantri2003@gmail.com",
        pass: appPassword,
    },
});