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
        const verificationEmailUrl = `http://localhost:3000/verify-email?token=${token}`;
        const text = `Dear user,
                             To verify your email, click on this link: ${verificationEmailUrl}
                             If you did not create an account, then ignore this email.`;
        await this.SendEmail(to, subject, text);
    };

    async SendPasswordRecoveryEmail(to, token) {
        const subject = 'Password Recovery for account abc';
        const recoveryUrl = `http:localhost:3000/change-password?token=${token}`;
        const text = `Dear user,
                        To recover your password, click on this link: ${recoveryUrl}
                        If you did not request to change password, then ignore the email.`
        await this.SendEmail(to, subject, text);
    }

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
            throw err;
        }
    }

    async GeneratePasswordRecoveryToken(user) {
        try {
            const data = {
                _id: user._id,
                role: '',
            }
            const tokenId = await tokenService.GenerateToken(data, 'RESET_PASSWORD', process.env.PASSWORD_RESET_SECRET_KEY, process.env.PASSWORD_RESET_LIFE_HOUR + 'h');
            const tokenExpires = moment().add(process.env.PASSWORD_RESET_LIFE_HOUR, 'hours');
            await tokenService.SaveTokenToDB(user._id, tokenId, 'RESET_PASSWORD', tokenExpires);
            return {
                token: tokenId,
                exp: tokenExpires.toDate()
            };
        }
        catch (err) {
            throw new Error(`Failed to generate password recovery token: ${err.message}`);
        }
    }

    async VerifyEmailToken(token) {
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
            throw err;
        }
    }
    async DecryptPasswordResetToken(token) {
        try {
            const data = await tokenService.VerifyToken(`Bearer ${token}`, 'RESET_PASSWORD', process.env.PASSWORD_RESET_SECRET_KEY);
            return data;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = new EmailService;