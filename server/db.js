const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://das1998lipun:HA45Vl3PRirrtzF9@cluster0.yj9s4ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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