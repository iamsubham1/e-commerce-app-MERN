const redisClient = require('../redis')
const Product = require('../models/ProductModel');
const jwt = require('jsonwebtoken');

const calculateTotalPrice = async (items) => {
    try {
        console.log("Cart items:", items);
        let totalValue = 0;

        // Extract product IDs and filter out invalid IDs
        const productIds = items
            .map(item => item.productId || (item.product && item.product.toString()))  // Handle both formats
            .filter(id => id);  // Filter out undefined or null IDs

        if (productIds.length === 0) {
            throw new Error('No valid products in cart.');
        }

        // Redis MGET equivalent for node-redis@v4
        const cachedPrices = await redisClient.sendCommand(['MGET', ...productIds.map(id => `product:${id}:price`)]);

        const missingProductIds = [];
        const pricesMap = {};

        // Check cached prices
        productIds.forEach((productId, index) => {
            const cachedPrice = cachedPrices[index];
            if (cachedPrice !== null) {
                pricesMap[productId] = parseFloat(cachedPrice);
            } else {
                missingProductIds.push(productId); // Products not found in cache
            }
        });

        // Fetch missing product prices from the database in one query
        if (missingProductIds.length > 0) {
            const missingProducts = await Product.find({ _id: { $in: missingProductIds } }, 'price');

            // Cache the fetched prices in Redis
            missingProducts.forEach(product => {
                pricesMap[product._id.toString()] = product.price;
                redisClient.set(`product:${product._id}:price`, product.price, 'EX', 3600); // Set expiry of 1 hour
            });
        }

        // Calculate total value using the prices map
        items.forEach(item => {
            const productPrice = pricesMap[item.productId || (item.product && item.product.toString())];
            if (productPrice) {
                totalValue += productPrice * item.quantity;
            }
        });

        return totalValue;
    } catch (error) {
        console.error('Error calculating total value:', error);
        throw error;
    }
};



const generateUniqueOTP = (length = 6) => {
    const chars = '0123456789';
    let otp = '';

    // Generate random OTP (5 digits)
    for (let i = 0; i < length - 1; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        otp += chars[randomIndex];
    }


    const timestamp = Date.now();
    otp += timestamp.toString().slice(-1);

    return otp;
}

const generateJWT = (user) => {
    const payload = {
        name: user.name,
        _id: user._id,
        email: user.email,
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
}
module.exports = { calculateTotalPrice, generateUniqueOTP, generateJWT };
