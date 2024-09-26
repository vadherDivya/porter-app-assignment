const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { models } = require('../constants/index');

const tokenSchema = new Schema(
    {
        jwtToken: {
            type: String,
            default: '',
        },
        refreshToken: {
            type: String,
            default: '',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Token', tokenSchema);
