const express = require('express');
const app = express();
const port = 4000;
const connectToMongo = require('./db.js');

const connectToRedis = require('./redis.js');

const startServer = async () => {
    try {



        app.use(express.json());



        app.get("/health", (req, res) => {
            res.json("health is running");
        });

        // Authentication routes
        app.use('/api/auth', require('./routes/auth.js'));

        // Product routes
        app.use('/api/product', require('./routes/product.js'));



        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

const initializeApp = async () => {

    await connectToMongo();

    await startServer();


};

initializeApp();
