const transporter = require('../../utils/email')

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
}

module.exports = new EmailService;