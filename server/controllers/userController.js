const User = require("../models/UserModel");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

require('dotenv').config({ path: '.env' });

const getUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (user) {
            await user.populate('orders');
            return res.status(200).send(user);
        }
        return res.status(400).send("No user found");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}

const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;

        const { address, type } = req.body;
        const user = await User.findById(userId);
        if (user) {
            console.log(user);
            user.address.push({ address, type });
            await user.save();
            return res.status(200).send(user);
        }

        return res.status(400).send("No user found");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}



module.exports = { getUserDetails, addAddress };