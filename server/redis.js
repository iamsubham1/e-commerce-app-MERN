const { createClient } = require('redis');

const client = createClient({
    password: 'eJRY5dzG5fGJBzXhud0UzuRgAzk1YTi8',
    socket: {
        host: 'redis-13999.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13999
    }
});
client.connect();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected'));



module.exports = client;