let moment = require('moment');
const { RIDE_STATUS, RIDE_STATUS_ENUM } = require('../../constants/rideStatus.constant');
const { USER_TYPES } = require('../../constants/user.constant');
const Ride = require("../../model/ride.model");
const User = require("../../model/user.model");
const InvalidRequestError = require('../../error/InvalidRequestError');
const commonService = require('../../services/common.service');

module.exports = {
    async createRide(req) {
        try {
            let body = req.body;
            const { pickupLocation, dropoffLocation, pickupLocationCoordinates, dropoffLocationCoordinates, fare } = body;
            const userId = req.user.id;
            const user = await User.findOne({_id: userId, isDeleted: false});
            if(!user) {
                throw new InvalidRequestError("User not found!")
            }

            if (!user || user.role !== USER_TYPES.DRIVER) {
                throw new InvalidRequestError('Only user can create rides');
            }

            if(!pickupLocation || !pickupLocationCoordinates || !dropoffLocation || !dropoffLocationCoordinates) {
                throw new InvalidRequestError('Pickup and Drop off location are required!');
            }
            if(!fare) {
                throw new InvalidRequestError('Ride fare required!');
            }
            body.userId = userId;
            const newRide = await Ride.create(body);

            return {
                message: 'Ride request created successfully',
                ride: newRide,
            };
        } catch (error) {
            throw error;
        }
    },

    async availableRide(req) {
        try {
            let body = req.body;
            let user = req.user;

            if (user.role !== USER_TYPES.DRIVER) {
                throw new InvalidRequestError({ error: 'Access denied.' });
            }
            const rides = await Ride.find({ status: RIDE_STATUS.REQUESTED }).populate('userId', 'name email');
            return { message: "Available ride found successfully", ride: rides };
        } catch (error) {
            throw error;
        }
    },

    async acceptRide(req) {
        try {
            let body = req.body;
            let user = req.user;
            let userId = req.userId;
            let rideId = req.params.id;
            if (user.role !== USER_TYPES.DRIVER) {
                throw new InvalidRequestError('Access denied.');
            }
            let updateObj = { 
                status: RIDE_STATUS.ACCEPTED, 
                driverId: userId, 
                acceptedDate: moment(new Date).toISOString()
            }
            const ride = await Ride.updateOne({ _id: rideId, status: RIDE_STATUS.REQUESTED, isDeleted: false }, 
                { $set: updateObj }, { new: true });
            if (!ride) {
                throw new InvalidRequestError('Ride not found.');
            }
            await User.updateOne({ _id: userId }, { $set: { isAvailable: false } });
            return { message: "Accept ride successfully", ride: ride };
        } catch (error) {
            throw error;
        }
    },

    async updateRideStatus(req) {
        try {
            let body = req.body;
            let user = req.user;
            let userId = req.userId;
            let rideId = req.params.id;
            if (user.role !== USER_TYPES.DRIVER) {
                throw new InvalidRequestError('Access denied.');
            }
            if(!body.status || !RIDE_STATUS_ENUM.includes(body.status)) {
                throw new InvalidRequestError('Ride status required!');
            }
            const ride = await Ride.findOne({_id: rideId, isDeleted: false, driverId: userId });
            if (!ride) {
                throw new InvalidRequestError('Ride not found.');
            }
            ride.status = body.status;
            await ride.save();

            return { message: "Ride status update successfully.", ride};
        } catch (error) {
            throw error;
        }
    },

    async getAllRides(req) {
        try {
            let body = req.body;
            let userId = req.userId;
            let user = req.user;
            body.filter = {...body, isDeleted: false};
            // if (user.role === USER_TYPES.DRIVER) {
            //     filter.driver = userId;
            // }
            const queryFilter = await commonService.getFilter(body);
            const rides = await Ride.find(queryFilter.where)
            .populate('userId', 'name email')
            .sort(queryFilter.sort)
            .skip(queryFilter.skip)
            .limit(queryFilter.limit);

            if (!rides && !rides.length) {
                throw new InvalidRequestError('Ride not found.');
            }
            let count = await Ride.count(queryFilter.where);
            let pagination = await commonService.paginationCount(count, body?.limit);            

            return { message: "Rides found successfully.", data: { rides, count, page: pagination.page, limit: pagination.limit } };
        } catch (error) {
            throw error;
        }
    },

    async getRideById(req) {
        try {
            let body = req.body;
            let userId = body.userId;
            let rideById = req.params.id;
            const ride = await Ride.findOne({ _id: rideById, isDeleted: false })
            .populate('userId', 'name email');

            if (!ride) {
                throw new InvalidRequestError('Ride not found.');
            }

            return { message: "Ride found successfully.", ride };
        } catch (error) {
            throw error;
        }
    },

    async completeRide(req) {
        try {
            let body = req.body;
            let userId = req.userId;
            let rideId = req.params.id;
            const ride = await Ride.findOne({ _id: rideId, driverId: userId, isDeleted: false })
            .populate('userId', 'name email');

            if (!ride) {
                throw new InvalidRequestError('Ride not found.');
            }
            let updateObj = {
                status: RIDE_STATUS.COMPLETED,
                completedDate: moment(new Date).toISOString()
            }
            const completeRide = await Ride.updateOne({ _id: rideId, isDeleted: false }, { $set: updateObj }, { new: true });
            await User.updateOne({ _id: userId, isDeleted: false }, { $set: { isAvailable: true } }, { new: true });

            return { message: "Ride completed successfully", ride: completeRide }
        } catch (error) {
            throw error;
        }
    }
}