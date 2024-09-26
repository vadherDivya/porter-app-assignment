const jwt = require('jsonwebtoken');
const User = require('../../model/user.model');
const Token = require('../../model/token.model');
const { USER_TYPE } = require('../../constants/user.constant');
module.exports.verify = async (req, res, next) => {
    const bearerHeader = req.headers.Authorization || req.headers.authorization || req.headers['access-token'];
    
    try {
        if (!bearerHeader) throw new Error('Authorization header not Found');
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        const decoded = jwt.verify(bearerToken, process.env.JWT_ACCESS_SECRET);
        const checkToken = await Token.findOne({ jwtToken: bearerToken });
        if (!checkToken) throw new Error('Authentication failed, Login again!');
        if (decoded) {
            const user = await User.findOne({
                _id: decoded._id,
            });
            if (!user) throw new Error('User Does Not Exist');
            req.userId = user._id;
            req.token = bearerToken;
            req.user = user;
            next();
        }
    } catch (error) {
        console.log('Authentication Failed', error);
        return res.status(200).json({
            status: false,
            message: 'Unauthorize user',
            data: {},
        });
    }
};

module.exports.authenticate = function (role) {
    return function (req, res, next) {
        //add your authentication logic here based on the role
        if (role === USER_TYPE[req.user.accountType]) {
            next();
        } else {
            console.log('Authentication Failed');
            res.status(200).json({
                status: false,
                message: 'Unauthorize user',
                data: {},
            });
        }
    };
};
