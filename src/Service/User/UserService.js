const { USER_TYPES } = require("../../constants/user.constant");
const User = require("../../model/user.model");

module.exports = {
    async updateUserRealTimeLocation(location, userId) {
        try {
            const user = await User.findOne({ _id: userId, role: USER_TYPES.DRIVER, isDeleted: false });

            if (!user) {
                return { error: 'User not found.' };
            }

            let updateUserLocation = await User.updateOne({ _id: userId, isDeleted: false }, { $set: { location } }, { new: true });
            return { message: "Update user's realtime location successfully", user: updateUserLocation };
        } catch (error) {
            throw error;
        }
    },

    async getNearByDriver(data, userId) {
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
                    $match: { _id: { $ne: new ObjectId(userId), isDeleted: false } }
                },
            ]);

            return { message: "Nearest Drivers found successfully", drivers: driver };
        } catch (error) {
            throw error;
        }
    }
}