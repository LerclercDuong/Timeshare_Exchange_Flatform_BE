const userService = require('../services/user.services.js');
const authService = require('../services/auth.services.js');
const tokenService = require('../services/token.service');
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');

class Authentication {
    
    async SignUp(req, res, next) {
        const {username, password, repeatPassword} = req.body;
        try {
            if (password === repeatPassword) {
                const userData = await authService.SignUp(username, password);
                const tokens = await authService.GenerateAuthToken(userData);
                res.status(StatusCodes.CREATED).json({userData, tokens})
            } else {
                throw new Error('Repeat password is wrong');
            }
        } catch (err) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: err.message})
        }
    }

    async Login(req, res, next) {
        const {username, password} = req.body;
        try {
            const userData = await authService.LoginWithUsernameAndPassword(username, password);
            if (userData) {
                const tokens = await authService.GenerateAuthToken(userData);
                res.status(StatusCodes.OK).json({userData, tokens});
            }else{
                res.status(StatusCodes.UNAUTHORIZED).json();
            }
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
        }
    }

    async RefreshAccessToken(req, res, next) {
        const {refreshToken} = req.body;
        try {
            const data = await authService.RefreshAuthToken(refreshToken);
            if(data){
                res.status(StatusCodes.OK).json({tokens: data})
            }else{
                res.status(StatusCodes.UNAUTHORIZED).json({message: err.message});
            }
            
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
        }
    }

    async CheckIsAuth(req, res, next){
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        if (authHeader) {
            try {
                const decodedToken = await jwt.verify(token, process.env.ACCESS_SECRET_KEY);
                if (decodedToken) res.status(StatusCodes.OK).json(decodedToken);
            } catch (e) {
                res.status(StatusCodes.UNAUTHORIZED).json({ isAuth: false });
            }
        } else res.status(StatusCodes.UNAUTHORIZED).json({ isAuth: false });
    }

    async loginWithGoogle(req, res, next) {

    }

    async forgotPassword(req, res) {

    }
}

module.exports = new Authentication;