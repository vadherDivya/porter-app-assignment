const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../helper/dbEncryption');
const { USER_TYPE_ENUM, USER_TYPES, USER_STATUS_ENUM, USER_STATUS } = require('../constants/user.constant');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: true,
        },
        dob: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        emailIsVerified: {
            type: Boolean,
            default: false,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: USER_TYPE_ENUM,
            default: USER_TYPES.DRIVER
        },
        phoneNumberIsVerified: { type: Boolean, default: false },
        changePasswordPin: { type: String },
        password: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        status: {
            type: String,
            enum: USER_STATUS_ENUM,
            required: true,
            default: USER_STATUS.ACTIVE,
        },
        location: {
            type: [Number],
            required: false,
        },
        isAvailable: {
            type: Boolean,
            default: false,
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
    },
    { timestamps: true, versionKey: false }
);

userSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password'];
        delete ret['__v']
        return ret
    }
})

mongoose.set('useFindAndModify', false);
userSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('User', userSchema);
