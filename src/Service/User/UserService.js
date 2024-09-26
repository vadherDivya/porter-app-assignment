const { USER_TYPES } = require("../../constants/user.constant");
const User = require("../../model/user.model");
const { ObjectId } = require('mongodb');

module.exports = {
    async updateUserRealTimeLocation(data) {
        try {
            const user = await User.findOne({ _id: data?.userId, role: USER_TYPES.DRIVER, isDeleted: false });

            if (!user) {
                return { error: 'User not found.' };
            }

            let updateUserLocation = await User.updateOne({ _id: data?.userId, isDeleted: false }, { $set: { location: data?.location } }, { new: true });
            return { message: "Update user's realtime location successfully", user: updateUserLocation };
        } catch (error) {
            throw error;
        }
    },

    async getNearByDriver(data) {
        try {
            const driver = await User.aggregate([
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: data.coordinates },
                        distanceField: 'dist.calculated',
                        maxDistance: data?.maxDistance ? data?.maxDistance : 1000,
                        spherical: true
                    }
                },
                {
                    $match: { _id: { $ne: new ObjectId(data.userId) }, isDeleted: false }
                },
            ]);

            return { message: "Nearest Drivers found successfully", drivers: driver };
        } catch (error) {
            throw error;
        }
    }
}