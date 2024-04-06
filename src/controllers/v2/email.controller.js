const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const emailService = require('../../services/v2/email.service')
const userService = require('../../services/v2/user.service');
const tokenService = require('../../services/v2/token.service');

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

    async SendPasswordRecoveryEmail(req, res, next) {
        try {
            const email = req.body.email;
            if (!email) {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'Email is not provided'});
            }
            else {
                const user = await userService.GetUserByEmail(email);
                if (user) {
                    const token = await emailService.GeneratePasswordRecoveryToken(user);
                    await emailService.SendPasswordRecoveryEmail(email, user.username, token.token);
                    res.status(StatusCodes.OK).json({message: 'Email sent'})
                }
                else res.status(StatusCodes.NOT_FOUND).json({message: 'Email is not associated with any account'});
            }
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
        }
        
    }

    async VerifyEmailVerification(req, res, next) {
        try {
            const token = req.query.token;
            console.log(token);
            if (!token) {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'Bad request, must have token as a parameter'});
            }
            else if (await emailService.VerifyEmailToken(token)) {
                res.status(StatusCodes.OK).json({message: 'Verify complete'});
            }
            else res.status(StatusCodes.BAD_REQUEST).json({message: 'Token is invalid or expired'});
        }
        catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
        }
    }
    async VerifyPasswordReset(req, res, next) {
        try {
            const token = req.body.token;
            const password = req.body.password;
            const passwordRepeat = req.body.passwordRepeat;
            if (!token || !password || !passwordRepeat) {
                res.status(StatusCodes.BAD_REQUEST).json({message: 'Missing required parameter'});
            }
            else {
                const data = await emailService.DecryptPasswordResetToken(token);
                console.log(data);
                if (data && data.user && data.user._id) {
                    if (password === passwordRepeat) {
                        //Update password
                        await userService.ResetPassword(data.user._id, password);
                        //TODO: Implement token invalidate
                        await tokenService.expireToken(data._id);
                        res.status(StatusCodes.OK).json({message: 'Password changed'});
                    }
                    else res.status(StatusCodes.BAD_REQUEST).json({message: 'Password does not match'});
                }
                else res.status(StatusCodes.BAD_REQUEST).json({message: 'Invalid or expired token'});
            }
        }
        catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
        }
    }
    async SendConfirmReservationEmail(req, res, next) {
        try {
            const reservationInfo = req.body;
            const user = await userService.GetUserById(reservationInfo.userId._id);
            console.log(user)
            if (reservationInfo?.is_confirmed === false) {
                const token = await tokenService.GenerateReservationConfirmToken(user._id);
                // Send verification email to the user
                await emailService.SendReservationConfirmEmail(reservationInfo.email, reservationInfo, token.token);
                res.status(StatusCodes.OK).json({
                    status: {
                        code: res.statusCode,
                        message: "Confirm reservation email was sent"
                    },
                    data: null
                })
            } else res.status(StatusCodes.FORBIDDEN).json({message: 'The reservation has been already confirmed'});
        } catch (err) {
            // res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
        }
    }
}

module.exports = new EmailController;