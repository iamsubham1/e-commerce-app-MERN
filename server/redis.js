const { createClient } = require('redis');
require('dotenv').config()

const client = createClient({
    password: process.env.RedisPassword,
    socket: {
        host: process.env.RedisHost,
        port: process.env.RedisPort
    }
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected'));



module.exports = client;