const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { RIDE_STATUS_ENUM, RIDE_STATUS } = require("../constants/rideStatus.constant");

const rideSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    pickupLocation: { 
        type: String, 
        required: true 
    },
    pickupLocationCoordinates: {
        type: [Number]
    },
    dropoffLocation: { 
        type: String, 
        required: true 
    },
    dropoffLocationCoordinates: {
        type: [Number]
    },
    status: { 
        type: String, 
        enum: RIDE_STATUS_ENUM, 
        default: RIDE_STATUS.REQUESTED
    },
    fare: {
        type: String
    },
    acceptedDate: {
        type: String,
    },
    completedDate: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Ride', rideSchema);