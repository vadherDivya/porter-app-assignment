const Joi = require('joi');
let moment = require('moment');
const User = require('../../../model/user.model');
const commonService = require('../../../services/common.service');

module.exports = {
    async paginate(req, res) {
        try {
            let body = req.body;
            let filter = await commonService.getFilter(body);
            let AllUser = await User.find(filter.where)
                .populate({
                    path: 'createdBy',
                    select: { username: 1, email: 1 },
                })
                .sort(body.sort)
                .skip(body.skip)
                .limit(body.limit);

            let count = await User.count(filter.where);
            let totalPages = parseInt(count) / parseInt(body.limit);
            totalPages = totalPages ? parseInt(totalPages) + 1 : 0;

            if (AllUser && AllUser.length) {
                return res.status(200).json({
                    status: true,
                    message: 'User get success.',
                    data: {
                        user: AllUser,
                        totalCount: count,
                        totalPages: totalPages,
                    },
                });
            }
            return res.status(400).json({
                status: false,
                message: 'User not found!',
                data: {},
            });
        } catch (error) {
            console.log('error', error);
            return res.status(500).json({
                status: false,
                message: 'Get user failed. Please try again!',
                data: {},
            });
        }
    },

    async userDetails(req, res) {
        try {
            let userId = req.params.id;
            const findCountry = await User.findOne({
                _id: userId,
                isDeleted: false,
            }).populate({
                path: 'createdBy',
                select: { username: 1, email: 1 },
            });
            if (findCountry) {
                return res.status(200).json({
                    status: true,
                    message: 'User get success.',
                    data: findCountry,
                });
            }

            return res.status(400).json({
                status: true,
                message: 'User not exist, Please create user!',
                data: {},
            });
        } catch (error) {
            console.log('error', error);
            return res.status(500).json({
                status: false,
                message: 'Get user failed. Please try again!',
                data: {},
            });
        }
    },
};
