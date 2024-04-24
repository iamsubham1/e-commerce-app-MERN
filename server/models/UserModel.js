const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    streetname: {
        type: String,
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    type: {
        type: String,
    }
});

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
    },
    password: {
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    profilePic: {
        name: {
            type: String
        },
        url: {
            type: String
        }
    },
    address: [addressSchema],

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});

// Custom validation to ensure unique types within user addresses
userSchema.path('address').validate((value) => {
    const types = new Set();
    for (const address of value) {
        if (types.has(address.type)) {
            return false;
        }
        types.add(address.type);
    }
    return true;
}, 'Address types must be unique for each user.');

const User = mongoose.model('User', userSchema);
module.exports = User;
