const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://Chat-appAdmin:chatappmongodb@cluster0.0ooijbc.mongodb.net/?retryWrites=true&w=majority"


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