const moment = require("moment");
const transporter = require('../../utils/email')
const tokenService = require('./token.service')
const userService = require('./user.service')
const ReservationModel = require('../../models/reservations')

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
        const verificationEmailUrl = `https://nicetripvn.vercel.app/email/verify-email?token=${token}`;
        const text = `Dear user,
                             To verify your email, click on this link: ${verificationEmailUrl}
                             If you did not create an account, then ignore this email.`;
        await this.SendEmail(to, subject, text);
    };

    async SendPasswordRecoveryEmail(to, username, token) {
        const subject = `Password Recovery for account ${username}`;
        const recoveryUrl = `https://nicetripvn.vercel.app/reset-password?token=${token}`;
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
    async countReservationsByTimeshareId(timeshareId) {
        try {
            const count = await ReservationModel.countDocuments({ timeshareId: timeshareId });
            return count;
        } catch (error) {
            throw new Error("Error counting reservations: " + error.message);
        }
    }
    
    async NotificationExchangeSuccessToOwnerTimeshareId(toOwnerMyTimeshare, reservationInfo) {
        const subject = 'You have notifications about at NiceTrip';
        const text = `Owner đã chấp nhận exchange. Đây là Trip của bạn`;
        await this.SendEmail(toOwnerMyTimeshare, subject, text);
    };
    async NotificationExchangeSuccessToOwnerMyTimeshareId(toOwnerTimeshare, reservationInfo) {
        const subject = 'You have notifications about at NiceTrip';
        const text = `Bạn đã chấp nhận exchange. Đây là Trip của bạn`;
        await this.SendEmail(toOwnerTimeshare, subject, text);
    };
    async NotificationExchangeCancelToOwnerMyTimeshareId(toOwnerMyTimeshare, reservationInfo) {
        const subject = 'You have notifications about at NiceTrip';
        const text = `Exchange request canceled. Please find different timeshare again`;
        await this.SendEmail(toOwnerMyTimeshare, subject, text);
    };

    async SendRequestExchange(to, reservationInfo, count, countExchange, countRent) {
        const subject = 'You have ' + count +' notifications about at NiceTrip';
        const text = `You have ${countExchange + countRent} notifications about at NiceTrip, including ${countExchange} exchange requests and ${countRent} rental requests`;
        await this.SendEmail(to, subject, text);
    };
    async SendReservationConfirmEmail(to, reservationInfo, token) {
        const timeshareId = reservationInfo.timeshareId._id;
        const reservationId = reservationInfo._id;
        const confirmReservationUrl = `https://nicetripvn.vercel.app/timeshare/${timeshareId}/reservation/${reservationId}/confirm?token=${token}`
        const subject = 'Reservation at NiceTrip';
        const text = `Thank you for your reservation at NiceTrip,
                             To confirm your reservation at post ${timeshareId}
                             Click on this link: 
                             <a href="${confirmReservationUrl}"></a>`;
        await this.SendEmail(to, subject, text);
    };
    

}

module.exports = new EmailService;