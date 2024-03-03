const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../../models/users');
const userService = require('./user.service.js');
const TokenModel = require('../../models/tokens')
const moment = require("moment");
const { ObjectId } = require('mongodb');

class TokenService {
    //generate jwt token
    //params: data (user data)
    async GenerateToken(data, type, tokenSecretKey, tokenLife) {
        const {_id, role} = data;
        const token = jwt.sign({
            sub: _id,
            role: role,
            type: type,
        }, tokenSecretKey, {expiresIn: tokenLife});
        return token;
    }

    async SaveTokenToDB(userId, token, type, exp) {
        return await TokenModel.create({
            user: userId,
            token: token,
            type: type,
            exp: exp.toDate(),
        });
    };

    async VerifyToken(bearerToken, type, secretKey) {
        const token = bearerToken.split(' ')[1];
        const payload = jwt.verify(token, secretKey);
        const tokenDoc = await TokenModel.findOne({token: token, type: type, user: payload.sub});
        if (!tokenDoc) {
            throw new Error('Token not found');
        }
        return tokenDoc;
    }

    async GenerateReservationConfirmToken(userId){
        try {
            const data = {
                _id: userId,
                role: '',
            }
            const tokenId = await this.GenerateToken(data, 'CONFIRM_RESERVATION', process.env.CONFIRM_RESERVATION_SECRET_KEY, process.env.CONFIRM_RESERVATION_LIFE_HOUR + 'h');
            const verifyTokenExpires = moment().add(process.env.CONFIRM_RESERVATION_LIFE_HOUR, 'hours');
            await this.SaveTokenToDB(userId, tokenId, 'CONFIRM_RESERVATION', verifyTokenExpires);
            return {
                token: tokenId,
                exp: verifyTokenExpires.toDate()
            };
        }
        catch (err) {
            throw err;
        }
    }
    async VerifyConfirmReservationToken(token){
        console.log(token)
        return this.VerifyToken(`Bearer ${token}`, 'CONFIRM_RESERVATION', process.env.CONFIRM_RESERVATION_SECRET_KEY);
    }

    async expireToken(tokenID) {

    }


    async logOut(username, password) {

    }

    async CheckPassword(username, password) {
        let password_correct = false;
        const hash_password = await users.findOne({username: username})
            .then((user) => {
                user.password = undefined;
                if (user) {
                    return user.password;
                } else {
                    return ' ';
                }
            })
        await bcrypt.compare(password, hash_password)
            .then(function (result) {
                if (result === true) {
                    password_correct = true;
                }
            });
        return password_correct;
    }

}

module.exports = new TokenService;