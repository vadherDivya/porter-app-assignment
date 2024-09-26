const Joi = require('joi');
const User = require('../../model/user.model');
const { getHasedPassword, comparedHased } = require('../../helper/utils');
const {
    saveTokenInDatabase,
    destroyAccessToken,
} = require('../../services/token.service');
const { randomNumber } = require('../../services/common.service');
const InvalidRequestError = require('../../error/InvalidRequestError');
const MailService = require('../../helper/mail/MailService');
const { encrypt, decrypt } = require('../../helper/dbEncryption');

module.exports = {
    async singUp(body) {
        try {
            const schema = Joi.object({
                username: Joi.string().required(),
                firstName: Joi.string(),
                lastName: Joi.string(),
                email: Joi.string().email().required(),
                mobile: Joi.string().max(10).required(),
                password: Joi.string().required(),
                dob: Joi.string(),
                profilePicture: Joi.string(),
                status: Joi.string(),
                role: Joi.string()
            });

            const { error, value } = schema.validate(body, {
                abortEarly: false,
            });

            if (error) {
                const errorMessage = error.details
                    .map((detail) => detail.message)
                    .join(', ');
                throw new InvalidRequestError(
                    `Validation error: ${errorMessage}`
                );
            }

            const existingUser = await User.findOne({
                $or: [{ email: body.email }, { mobile: body.mobile }],
            });

            if (existingUser) {
                throw new InvalidRequestError(
                    'User already exists. Please try another email or mobile number.'
                );
            }

            if (body.password) {
                body.password = getHasedPassword(body.password, 10);
            }

            const newUser = await User.create(body);
            return newUser;
        } catch (error) {
            throw error;
        }
    },

    async login(body) {
        try {
            const createUserSchema = Joi.object().keys({
                username: Joi.string(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
            });

            const { error, value } = createUserSchema.validate(body);
            if (error) {
                throw new InvalidRequestError(
                    `${error?.details[0]?.message} : "The information requested is not valid. "`
                );
            }

            let checkExistUser = await User.findOne({
                $or: [
                    {
                        email: body.email,
                    },
                    {
                        username: body.mobile,
                    },
                ],
            });
            if (!checkExistUser) {
                throw new InvalidRequestError('User is not registered!');
            }

            if (body.password) {
                let matchedPassword = await comparedHased(
                    body.password,
                    checkExistUser.password
                );
                if (!matchedPassword) {
                    throw new InvalidRequestError('Enter wrong password!');
                }
            }

            let token = await saveTokenInDatabase(checkExistUser);
            await User.updateOne({ _id: checkExistUser._id }, { $set: { isAvailable: true }})
            return {
                token: token.jwtToken,
                refreshToken: token.refreshToken,
                user: checkExistUser,
            };
        } catch (error) {
            throw error;
        }
    },

    async sendOtp(body, req) {
        try {
            const createUserSchema = Joi.object().keys({
                email: Joi.string().email().required(),
                mobile: Joi.string().max(10),
            });

            const { error, value } = createUserSchema.validate(body);
            if (error) {
                throw new InvalidRequestError(
                    `${error?.details[0]?.message} : "The information requested is not valid. "`
                );
            }
            let checkExistUser = await User.findOne({
                $or: [
                    {
                        email: body.email,
                    },
                    {
                        username: body.mobile,
                    },
                ],
            });
            if (!checkExistUser) {
                throw new InvalidRequestError('The user is not registered.');
            }
            const pinNumber = randomNumber();
            const changePasswordReq = await User.findOneAndUpdate(
                { _id: req.userId },
                { $set: { changePasswordPin: pinNumber } },
                { new: true }
            );
            const subject =
                'Your OTP for ' +
                process.env['APP_NAME'] +
                ' is ' +
                changePasswordReq.changePasswordPin;

            const html = subject;

            await MailService.sendMail(subject, html, changePasswordReq.email);

            return 'OTP send successfully';
        } catch (error) {
            throw error;
        }
    },

    async changePassword(body) {
        try {
            const createUserSchema = Joi.object().keys({
                email: Joi.string().email().required(),
                otp: Joi.string().max(4),
                password: Joi.string().required(),
            });

            // validate the request data against the schema
            const { error, value } = createUserSchema.validate(body);
            if (error) {
                throw new InvalidRequestError(
                    `${error?.details[0]?.message} : "The information requested is not valid. "`
                );
            }
            let checkExistUser = await User.findOne({
                email: body.email,
                changePasswordPin: body.otp,
            });
            if (!checkExistUser) {
                throw new InvalidRequestError('Invalid OTP!');
            }
            if (body.password) {
                body.password = getHasedPassword(body.password, 10);
            }
            const updatePassword = await User.findOneAndUpdate(
                {
                    _id: checkExistUser._id,
                },
                { $set: { password: body.password } },
                { new: true }
            );
            if (updatePassword) {
                await User.findByIdAndUpdate(
                    { _id: checkExistUser._id },
                    { $unset: { changePasswordPin: '' } },
                    { new: true }
                );
                let updatedUser = await User.findOne({
                    email: body.email,
                });
                return updatedUser;
            }
        } catch (error) {
            throw error;
        }
    },

    async updateProfile(req, body) {
        try {
            const userId = req.userId;
            if(!body) {
                throw new InvalidRequestError('Bad Request!');
            }
            if(body.email) {
                throw new InvalidRequestError('You can not change email!');
            }
            if(body.mobile) {
                throw new InvalidRequestError('You can not change mobile!');
            }

            let checkUserExist = await User.findOne({
                _id: userId,
            });

            if(!checkUserExist) {
                throw new InvalidRequestError('User does not found!');
            }

            let updateObject = body;

            // updateObject.username = encrypt(updateObject?.username);
            // updateObject.firstName = encrypt(updateObject?.firstName);
            // updateObject.lastName = encrypt(updateObject?.lastName);
            // updateObject.dob = encrypt(updateObject?.dob);
            
            const updateUser = await User.findOneAndUpdate(
                {
                    _id: userId,
                },
                { $set: updateObject},
            );
            if (updateUser) {
                let user = await User.findOne({
                    _id: userId,
                });
                return user;
            }

            return updateUser;
        } catch (error) {
            throw error;
        }
    },

    async getProfile(req) {
        try {
            const userId = req.userId;
            let user = await User.findOne({ _id: userId, isDeleted: false });
            if(!user) {
                throw new InvalidRequestError('User does not found!');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
};
