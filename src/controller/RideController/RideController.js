const RideService = require("../../Service/Ride/RideService");

module.exports = {
    async createNewRide(req, res) {
        try {
            const newRide = await RideService.createRide(req);
            return res.status(200).json({
                status: true,
                message: newRide.message,
                data: newRide.ride,
            });
        } catch (error) {
            console.log('error***********', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async availableRide(req, res) {
        try {
            const availableRide = await RideService.availableRide(req);
            return res.status(200).json({
                status: true,
                message: availableRide.message,
                data: availableRide.ride,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async acceptRide(req, res) {
        try {
            let accepted = await RideService.acceptRide(req);
            return res.status(200).json({
                status: true,
                message: accepted.message,
                data: accepted.ride,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async updateRideStatus(req, res) {
        try {
            const updatedRide = await RideService.updateRideStatus(req);
            return res.status(200).json({
                status: true,
                message: updatedRide.message,
                data: updatedRide.ride,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async getAllRides(req, res) {
        try {
            const allRides = await RideService.getAllRides(req);
            return res.status(200).json({
                status: true,
                message: allRides.message,
                data: allRides.data,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async rideById(req, res) {
        try {
            const rideById = await RideService.getRideById(req);
            return res.status(200).json({
                status: true,
                message: rideById.message,
                data: rideById.ride,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },

    async rideComplete(req, res) {
        try {
            const updatedRide = await RideService.completeRide(req);
            return res.status(200).json({
                status: true,
                message: updatedRide.message,
                data: updatedRide.ride,
            });
        } catch (error) {
            console.log('error', error);
            return res.status(error.statusCode | 400).json(error);
        }
    },
}