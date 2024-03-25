const mongoose = require('mongoose');
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI;


const connectomongodb = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        console.log("Connected to MongoDB successfully");

    } catch (error) {
        console.log(error);
        process.exit();
    }
}

module.exports = connectomongodb;