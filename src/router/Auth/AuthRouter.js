'use strict';

let express = require('express');
let AuthRoute = express.Router();
const Auth = require('../../controller/Auth/authorizer');
const AuthController = require('../../controller/Auth/AuthController');

AuthRoute.post('/').use('/register', AuthController.register);
AuthRoute.post('/').use('/login', AuthController.login);

AuthRoute.use(Auth.verify);
AuthRoute.post('/').use('/sendOtp', AuthController.sendOtp);
AuthRoute.post('/').use('/changePassword', AuthController.changePassword);
AuthRoute.post('/').use('/changeProfile', AuthController.changeProfile);
AuthRoute.get('/').use('/getProfile', AuthController.getProfile);

module.exports = AuthRoute;
