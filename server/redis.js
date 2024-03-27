const { createClient } = require('redis');
require('dotenv').config()

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected'));



module.exports = client;