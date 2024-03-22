const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: "string",
        required: "true"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    profilePic: {
        type: String,

    },
    address: {
        type: String,
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'

        }
    ]
})

const User = mongoose.model('User', userSchema);
module.exports = User;