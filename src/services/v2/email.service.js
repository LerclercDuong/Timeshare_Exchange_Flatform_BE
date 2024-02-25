const moment = require("moment");
const transporter = require('../../utils/email')
const tokenService = require('./token.service')
const userService = require('./user.service')

class EmailService {
    /**
     * Send an email
     * @param {string} to
     * @param {string} subject
     * @param {string} text
     * @returns {Promise}
     */
    async SendEmail(to, subject, text) {
        const msg = {to, subject, text};
        await transporter.sendMail(msg);
    }

    async SendVerificationEmail(to, token) {
        const subject = 'Email Verification';
        const verificationEmailUrl = `http://localhost:8080/verify-email?token=${token}`;
        const text = `Dear user,
                             To verify your email, click on this link: ${verificationEmailUrl}
                             If you did not create an account, then ignore this email.`;
        await this.SendEmail(to, subject, text);
    };

    async SendReservationInfo(to, reservationInfo) {
        const subject = 'Reservation at NiceTrip';
        const text = `Thank you for your reservation at NiceTrip, please waiting for owner acceptance`;
        await this.SendEmail(to, subject, text);
    };
    async GenerateVerifyToken(userId) {
        try {
            const data = {
                _id: userId,
                role: '',
            }
            const verifyTokenId = await tokenService.GenerateToken(data, 'VERIFY_EMAIL', process.env.EMAIL_SECRET_KEY, process.env.EMAIL_TOKEN_LIFE_HOUR + 'h');
            const verifyTokenExpires = moment().add(process.env.ACCESS_TOKEN_LIFE_HOUR, 'hours');
            await tokenService.SaveTokenToDB(userId, verifyTokenId, 'VERIFY_EMAIL', verifyTokenExpires);
            return {
                token: verifyTokenId,
                exp: verifyTokenExpires.toDate()
            };
        }
        catch (err) {
            console.log(err.message);
        }
    }

    async VerifyToken(token) {
        try {
            let result = false;
            console.log(token);
            const data = await tokenService.VerifyToken(`Bearer ${token}`, 'VERIFY_EMAIL', process.env.EMAIL_SECRET_KEY);
            if (data) {
                userService.UpdateEmailStatus(data.user._id);
                result = true;
            }
            return result;
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = new EmailService;