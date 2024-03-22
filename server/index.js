const express = require('express');
const app = express();
const port = 4000;
const connectToMongo = require('./db.js');
const redis = require('redis');
const { promisify } = require('util');

const { createClient } = require('redis');

const client = createClient({
    password: 'eJRY5dzG5fGJBzXhud0UzuRgAzk1YTi8',
    host: 'redis-13999.c212.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 13999
});
const startServer = async () => {
    try {
        app.use(express.json());

        await connectToMongo();

        app.get("/health", (req, res) => {
            res.json("health is running");
        });

        // Authentication routes
        app.use('/api/auth', require('./routes/auth.js'));

        // Product routes
        app.use('/api/product', require('./routes/product.js'));

        // Listen for Redis connection event
        client.on('connect', () => {
            console.log('Connected to Redis');
        });

        // Listen for Redis connection error
        client.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        // Start Express server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

const initializeApp = async () => {
    try {
        await startServer();
        console.log('Server started successfully.');
    } catch (error) {
        console.error('Error initializing app:', error);
        process.exit(1); // Exit process with error status
    }
};

initializeApp();
