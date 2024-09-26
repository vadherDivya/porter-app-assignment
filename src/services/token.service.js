const jwt = require('jsonwebtoken');
const Token = require('../model/token.model');

module.exports.signAccessToken = async (_id) => {
    console.log(
        'process.env.ACCESS_TOKEN_EXPIRE_TIME',
        process.env.ACCESS_TOKEN_EXPIRE_TIME
    );
    return jwt.sign({ _id: _id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME, // expires in 15 min
        //expiresIn: 86400,
    });
};

module.exports.destroyAccessToken = async (token) => {
    await Token.deleteOne({ jwtToken: token });
};

module.exports.signRefreshToken = async (_id) => {
    return jwt.sign({ _id: _id }, process.env.JWT_REFRESH_SECRET, {
        //expiresIn: 86400 // expires in 24 hours
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        //expiresIn: "7d",
    });
};

module.exports.saveTokenInDatabase = async (user) => {
    console.log('START:- saveToken function');
    try {
        const token = await this.signAccessToken(user._id);
        const refreshToken = await this.signRefreshToken(user._id);
        const tokenModelResponse = await this.createTokenObject(
            token,
            refreshToken,
            user
        );
        return await Token.create(tokenModelResponse);
    } catch (err) {
        console.log(err.message, err);
        throw err.message;
    }
};

module.exports.createTokenObject = async (token, refreshToken, user) => {
    console.log('START:- createTokenObject function');
    const tokenInsert = {
        createdOn: new Date(),
        jwtToken: token,
        refreshToken: refreshToken,
        updatedOn: new Date(),
        user: user._id,
    };
    // console.log("token inserting data", tokenInsert);

    return await tokenInsert;
};

module.exports.decodeRefreshToken = async (token) => {
    console.log('START:- decodeRefreshToken function');
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        console.log(err.message, err);
        throw err.message;
    }
};

module.exports.findToken = async (condition, project) => {
    console.log('START:- findToken function');
    try {
        const findToken = await Token.findOne(condition, project);
        console.log('findToken', findToken);
        return findToken;
    } catch (err) {
        console.log('err', err);
        throw err;
    }
};

module.exports.updateToken = async (_id, updateData) => {
    console.log('START:- updateToken function');
    try {
        const updateToken = await Token.findByIdAndUpdate(_id, updateData);
        return updateToken;
    } catch (err) {
        console.log('updateToken', err);
        throw err;
    }
};

module.exports.refreshToken = async (req, res) => {
    console.log('START:- refreshToken function');
    try {
        const body = JSON.parse(req.body);
        console.log('refresh token', body.refreshToken);
        const decoded = await this.decodeRefreshToken(body.refreshToken);
        console.log('decoded', decoded);
        if (decoded) {
            const findRefreshToken = await this.checkTokenExist(
                req,
                res,
                decoded._id,
                body.refreshToken
            );
            if (findRefreshToken.success) {
                const accessToken = await this.signAccessToken(
                    findRefreshToken.user
                );
                const updatedData = await this.updateToken(
                    findRefreshToken._id,
                    {
                        jwtToken: accessToken,
                        updatedOn: new Date(),
                    }
                );
                if (updatedData)
                    return await this.refreshResponse(req, res, accessToken);
            } else return findRefreshToken;
        } else return await this.refreshTokenExpiredResponse(req, res);
    } catch (err) {
        console.log('refreshToken function error', err);
        throw err;
    }
};

module.exports.checkTokenExist = async (req, res, _id, token) => {
    console.log('START:- checkTokenExist function');
    try {
        const userQuery = {
            refreshToken: token,
            user: _id,
            status: 0,
        };
        const userProjection = {
            _id: 1,
            status: 1,
            jwtToken: 1,
            refreshToken: 1,
            user: 1,
        };
        console.log('userQuery', userQuery);
        const findToken = await this.findToken(userQuery, userProjection);
        if (findToken) {
            findToken.success = true;
            return findToken;
        } else return await this.refreshTokenNotFoundResponse(req, res);
    } catch (err) {
        console.log('refreshToken function error', err);
        throw err;
    }
};

module.exports.refreshTokenExpiredResponse = async (req, res) => {
    console.log('START:- refreshTokenExpiredResponse function');
    try {
        return {
            res: res,
            req: req,
            handler: 'auth',
            messageCode: 'E011',
            success: false,
        };
    } catch (err) {
        console.log('refreshTokenExpiredResponse function error', err);
        throw err;
    }
};

module.exports.refreshTokenNotFoundResponse = async (req, res) => {
    console.log('START:- refreshTokenNotFoundResponse function');
    try {
        return {
            res: res,
            req: req,
            handler: 'auth',
            messageCode: 'E012',
            success: false,
        };
    } catch (err) {
        console.log('refreshTokenNotFoundResponse function error', err);
        throw err;
    }
};

module.exports.refreshResponse = async (req, res, accessToken) => {
    console.log('START:- refreshResponse response function');
    return {
        res: res,
        data: accessToken,
        req: req,
        handler: 'auth',
        messageCode: 'S005',
        success: true,
    };
};
