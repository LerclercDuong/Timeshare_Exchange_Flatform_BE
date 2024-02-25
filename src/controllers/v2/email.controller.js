const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const emailService = require('../../services/v2/email.service')
const userService = require('../../services/v2/user.service')

class EmailController {
    async SendVerificationCode(req, res, next) {
        try {
            const user = await userService.GetUserById(req.user.userId);
            // If the user is not verified, send the verification link
            if (user.emailVerified == false) {
                // Generate token
                const token = await emailService.GenerateVerifyToken(user._id);
                // Send verification email to the user
                emailService.SendVerificationEmail(user.email, token.token);
                res.status(StatusCodes.OK).json({message: "Email sent"});
            }
            else res.status(StatusCodes.FORBIDDEN).json({message: 'The email is already verified'});
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
        }
    }

    async VerifyEmail(req, res, next) {
        try {
            const token = req.query.token;
            console.log(token);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'Bad request, must have token as a parameter'});
            }
            else if (await emailService.VerifyToken(token)) {
                res.status(StatusCodes.OK).json({message: 'Verify complete'});
            }
            else res.status(StatusCodes.BAD_REQUEST).json({message: 'Token is invalid or expired'});
        }
        catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
        }
    }
}

module.exports = new EmailController;