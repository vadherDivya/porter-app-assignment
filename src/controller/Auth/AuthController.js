const AuthService = require('../../Service/Auth/AuthService');
const { USER_STATUS, USER_TYPES } = require('../../constants/user.constant');

module.exports = {
    async register(req, res) {
        try {
            const body = req.body;
            body.status = USER_STATUS.ACTIVE;
            if(!body.role) {
                body.role = USER_TYPES.DRIVER;
            }
            const newUser = await AuthService.singUp(body);
            return res.status(200).json({
                message: 'Register successfully.',
                data: newUser,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async login(req, res) {
        try {
            const body = req.body;
            const loginUser = await AuthService.login(body);
            return res.status(200).send({
                message: 'Login successfully.',
                data: loginUser,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async sendOtp(req, res) {
        try {
            const body = req.body;
            const changedPassword = await AuthService.sendOtp(body, req);
            return res.status(200).send({
                message: 'Generate OTP successfully.',
                data: changedPassword,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async changePassword(req, res) {
        try {
            const body = req.body;
            const updatePassword = await AuthService.changePassword(body);
            if (updatePassword) {
                return res.status(200).send({
                    message: 'Password update successfully.',
                    data: updatePassword,
                });
            }
            return res.status(400).json({
                message: 'Update password failed, Please try again!',
                data: {},
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async changeProfile(req, res) {
        try {
            const body = req.body;
            const updateProfile = await AuthService.updateProfile(req, body);
            if (updateProfile) {
                return res.status(200).send({
                    message: 'Profile update successfully.',
                    data: updateProfile,
                });
            }
            return res.status(400).json({
                message: 'Profile update failed, Please try again!',
                data: {},
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async getProfile(req, res) {
        try {
            const body = req.body;
            const profile = await AuthService.getProfile(req);
            if (profile) {
                return res.status(200).send({
                    message: 'Profile found successfully.',
                    data: profile,
                });
            }
            return res.status(400).json({
                message: 'Profile failed, Please try again!',
                data: {},
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    }
};
