const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,

        unique: true
    },
    password: {
        type: String,

    },

    profilePic: {
        name: {
            type: String
        },
        url: {
            type: String
        }
    },
    address: [{
        streetname: {
            type: String,
        }, landmark: {
            type: String,
        }, city: {
            type: String,
        }, state: {
            type: String,
        }, pincode: {
            type: Number,
        },
        type: {
            type: String,
            unique: true
        }

    }],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'

        }
    ]
})

const User = mongoose.model('User', userSchema);
module.exports = User;