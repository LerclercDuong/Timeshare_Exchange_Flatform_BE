const userService = require('../../services/v2/user.service.js');
const authService = require('../../services/v2/auth.service.js');
const tokenService = require('../../services/v2/token.service');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

class AuthController {

    //Register:
    //Req: firstname, lastname, username, password, repeatPassword
    //Res: userData = {}, tokens = []
    async Register(req, res, next) {
        try {
            const { firstname, lastname, username, email, password, repeatPassword } = req.body;
            if (password !== repeatPassword) {
                throw new Error('Password and repeat password do not match');
            }
            const userData = await authService.SignUp(firstname, lastname, username, email, password);
            const tokens = await authService.GenerateAuthToken(userData);
            res.status(StatusCodes.CREATED).json({ userData, tokens });
        } catch (err) {
            console.log(err)
            res.status(StatusCodes.BAD_REQUEST).send(err.message);
        }
    }
    //Login:
    //Req: username, password
    //Res: userData = {}, tokens = []
    async Login(req, res, next) {
        const {username, password} = req.body;
        try {
            const loginData = await authService.LoginWithUsernameAndPassword(username, password);
            if (loginData) {
                const tokens = await authService.GenerateAuthToken(loginData);
                res.status(StatusCodes.OK).json(
                    {
                        status: {
                            code: res.statusCode,
                            message: 'Login successfully'
                        },
                        data: {user: loginData, tokens}
                    }
                );
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    status: {
                        code: res.statusCode,
                        message: 'Login fail'
                    },
                    data: null
                });
            }
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
        }
    }


    async RefreshAccessToken(req, res, next) {
        const { refreshToken } = req.body;
        try {
            const data = await authService.RefreshAuthToken(refreshToken);
            if (data) {
                res.status(StatusCodes.OK).json({ tokens: data })
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: err.message });
            }
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
        }
    }

    async CheckIsAuth(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.split(' ')[1];
                const decodedToken = await jwt.verify(token, process.env.ACCESS_SECRET_KEY);
                if (decodedToken) {
                    const userData = await userService.GetUserById(decodedToken.sub)
                    res.status(StatusCodes.OK).json({
                        status: {
                            code: res.statusCode,
                            message: 'Authenticated'
                        },
                        data: {
                            user: userData
                        }
                    })
                }
            } catch (e) {
                res.status(StatusCodes.UNAUTHORIZED).json({isAuth: false});
            }
        } else res.status(StatusCodes.UNAUTHORIZED).json({isAuth: false});
    }

    async loginWithGoogle(req, res, next) {

    }
}

module.exports = new AuthController;