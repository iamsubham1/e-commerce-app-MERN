const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const { calculateTotalPrice } = require('../utility/helperFunctions');
const redisClient = require('../redis');
const axios = require("axios");
const uniqid = require('uniqid');
const crypto = require("crypto");

const sha256 = require("sha256");

const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const MERCHANT_ID = "PGTESTPAYUAT86";
const SALT_INDEX = 1;
const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076"

const addtocart = async (req, res) => {

    try {
        const { productId, quantity } = req.body;
        console.log("req.body -------------> ", productId, quantity)

        // if no quantity given then 1 
        const userId = req.user._id;
        const user = await User.findById(userId);
        let shoppingCart = await Cart.findOne({ userId });

        if (!shoppingCart) {
            shoppingCart = new Cart({ userId, items: [], totalValue: 0 });
            await shoppingCart.save();

            user.cart = shoppingCart._id;
            await user.save();
        }


        const existingItem = shoppingCart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            // If product already exists in the cart, update the quantity
            existingItem.quantity += quantity ? Number(quantity) : 1;
        } else {
            // If product doesn't exist in the cart, add a new item
            shoppingCart.items.push({ product: productId, quantity: quantity ? Number(quantity) : 1 });
        }

        // Calculate total value of the cart based on product prices
        const totalValue = await calculateTotalPrice(shoppingCart.items);

        // Update the totalValue field of the cart
        shoppingCart.totalValue = totalValue;

        // Save the updated cart
        await shoppingCart.save();

        // console.log(shoppingCart);
        const response = await shoppingCart.populate('items.product', 'name reviews pictures price'); // Populate product info
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCartDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);

        const cartDetails = await Cart.findOne({ userId }).populate('items.product', 'name reviews pictures price');

        if (cartDetails) {
            return res.status(200).json(cartDetails);
        } else {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let shoppingCart = await Cart.findOne({ userId });

        if (!shoppingCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the item in the cart
        const cartItem = shoppingCart.items.find(item => item.product.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        if (quantity == 0) {
            // Remove the item from the cart
            shoppingCart.items = shoppingCart.items.filter(item => item.product.toString() !== productId);
        } else {
            // Decrease the quantity of the item
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                // If quantity is already 1, remove the item from the cart
                shoppingCart.items = shoppingCart.items.filter(item => item.product.toString() !== productId);
            }
        }

        const totalValue = await calculateTotalPrice(shoppingCart.items);

        // Update the totalValue field of the cart
        shoppingCart.totalValue = totalValue;

        await shoppingCart.save();
        const response = await shoppingCart.populate('items.product', 'name reviews pictures price'); // Populate product info
        return res.status(200).send(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const clearCart = async (req, res) => {
    try {

        console.log("triggered clear cart");
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Clear all items from the cart
        cart.items = [];
        cart.totalValue = 0;

        // Save the updated empty cart
        await cart.save();

        return res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// added redis to update products stock

const createOrder = async (req, res) => {
    const token = req.header('JWT');
    console.log("------------------------------------------> in create order", token);
    const generateFakeTransactionId = () => {
        return 'fake_txn_' + Math.random().toString(36).substring(2);
    };

    console.log("Reached create order------------>", req.body);

    try {
        const userId = req.user._id;
        const products = req.body.products;
        const paymentMode = req.body.paymentMode;

        if (!['COD', 'ONLINE'].includes(paymentMode)) {
            console.error('Invalid payment mode:', paymentMode);
            return res.status(400).json({ error: 'Invalid payment mode. Must be COD or ONLINE.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error('User not found for ID:', userId);
            return res.status(400).json({ error: "User not found" });
        }

        // Fetch all product IDs and their current quantities from the database
        const productIds = products.map(p => p.productId);
        const foundProducts = await Product.find({ _id: { $in: productIds } }, '_id quantity');

        // Check if any product is out of stock before proceeding
        for (const { productId, quantity } of products) {
            const product = foundProducts.find(p => p._id.toString() === productId);
            if (!product) {
                console.error('Product not found:', productId);
                return res.status(404).json({ error: `Product with ID ${productId} not found` });
            }
            if (product.quantity < quantity) {
                console.error('Insufficient stock for product:', productId);
                return res.status(400).json({ error: `Insufficient stock for product ${productId}` });
            }
        }

        // Calculate total price based on the product prices and quantities in the cart
        const totalPrice = await calculateTotalPrice(products);
        console.log("Total Price:", totalPrice);

        // Create the order
        const order = new Order({
            userId,
            products,
            totalPrice,
            paymentMode,
            paymentStatus: req.body.paymentStatus,
            status: req.body.status,
            transactionId: paymentMode === 'COD' ? generateFakeTransactionId() : req.body.transactionId,
        });

        console.log("Created Order:", order);

        // Save the order to the database
        await order.save();
        console.log("Order saved to database:", order._id);

        user.orders.push(order._id);
        await user.save();
        console.log("User orders updated:", user.orders);

        // Bulk update product quantities in MongoDB
        const bulkOperations = products.map(({ productId, quantity }) => ({
            updateOne: {
                filter: { _id: productId },
                update: { $inc: { quantity: -quantity } }
            }
        }));
        console.log("Bulk Operations for MongoDB:", bulkOperations);
        await Product.bulkWrite(bulkOperations);
        console.log("Product quantities updated in MongoDB");

        // Update Redis cache for product quantities
        try {
            const redisData = await redisClient.get('products');
            if (redisData) {
                const productsArray = JSON.parse(redisData);
                const updatedProducts = productsArray.map(product => {
                    const cartProduct = products.find(p => p.productId === product._id.toString());
                    if (cartProduct) {
                        product.quantity -= cartProduct.quantity;
                    }
                    return product;
                });
                await redisClient.set('products', JSON.stringify(updatedProducts));
                console.log('Products array updated in Redis');
            }
        } catch (error) {
            console.error('Error updating products array in Redis:', error);
        }

        // Call the clearCart API
        try {
            console.log('before axios', token);
            const response = await fetch('http://localhost:8080/api/order/clearcart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'JWT': token
                }

            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Cart cleared successfully:', data);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }

        // Return order details
        return res.status(201).json({
            message: 'Order created successfully',
            order: order._id,
            success: true
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




const orderDetails = async (req, res) => {

    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId: userId }).populate('products.productId', 'name pictures price');

        console.log(orders, userId);
        if (orders !== null) {
            return res.status(200).send(orders);
        } else {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

};


const paymentHandler = async (req, res) => {

};


const newPayment = async (req, res) => {
    try {
        const payEndpoint = '/pg/v1/pay';
        const merchantTransactionId = uniqid();
        const userId = req.user._id; // Use user ID from req.user
        console.log(req.body.data);
        // Ensure token is available in req.headers or req.user
        const token = req.headers.jwt;

        const payload = {
            "merchantId": MERCHANT_ID,
            "merchantTransactionId": merchantTransactionId,
            "merchantUserId": userId,
            "amount": Math.round(req.body.amount * 100), // in paise
            "redirectUrl": `http://localhost:8080/api/order/status/${merchantTransactionId}?data=${encodeURIComponent(JSON.stringify(req.body.data))}&userId=${userId}&token=${encodeURIComponent(token)}`,
            "redirectMode": "REDIRECT",
            "mobileNumber": req.body.phoneNumber,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        };

        // SHA256 calculation
        const bufferObj = Buffer.from(JSON.stringify(payload), 'utf-8');
        const base64EncodedPayload = bufferObj.toString('base64');
        const xVerify = sha256(base64EncodedPayload + payEndpoint + SALT_KEY) + '###' + SALT_INDEX;

        const options = {
            method: 'post',
            url: `${PHONE_PE_HOST_URL}${payEndpoint}`,
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify
            },
            data: {
                request: base64EncodedPayload
            }
        };

        const response = await axios.request(options);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};


const statusCheck = async (req, res) => {
    try {
        console.log('Received request with params:', req.params);
        console.log('Received request with query:', req.query);

        const merchantTransactionId = req.params.id;
        const { data, userId, token } = req.query; // Extract token from query parameters
        const merchantId = MERCHANT_ID;
        const statusEndpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;

        console.log('Status Endpoint:', statusEndpoint);

        if (!data || !userId || !token) {
            throw new Error('Missing query parameters: data, userId, or token');
        }

        const decodedData = decodeURIComponent(data);

        const parsedData = JSON.parse(decodedData);
        console.log('Parsed Data:', parsedData);

        const stringToHash = statusEndpoint + SALT_KEY;
        const sha256Checksum = sha256(stringToHash);
        const xVerify = sha256Checksum + '###' + SALT_INDEX;

        const options = {
            method: 'GET',
            url: `${PHONE_PE_HOST_URL}${statusEndpoint}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': xVerify,
                'X-MERCHANT-ID': merchantId
            }
        };

        console.log('API Request Options:', options);

        const response = await axios.request(options);
        const responseData = response.data;

        if (responseData.success) {
            const orderPayload = {
                products: parsedData.products,  // Assuming `data` contains the products
                paymentMode: 'ONLINE',
                paymentStatus: 'SUCCESS',
                transactionId: merchantTransactionId // Payment was successful
            };

            console.log('Order Payload:', orderPayload);
            console.log('Body:', JSON.stringify(orderPayload));

            const createOrderResponse = await fetch('http://localhost:8080/api/order/placeorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'JWT': token
                },
                body: JSON.stringify(orderPayload)
            });

            const createOrderResponseJson = await createOrderResponse.json(); // Convert response to JSON
            console.log('Create Order Response:', createOrderResponseJson);

            if (createOrderResponseJson.success) {
                return res.redirect('http://localhost:5173/success');
            } else {
                return res.redirect('http://localhost:5173/failure');
            }
        } else {
            return res.redirect('http://localhost:5173/failure');
        }
    } catch (error) {
        console.error('Error in statusCheck:', error);
        res.status(500).send({
            message: error.message,
            success: false
        });
    }
};




module.exports = { addtocart, getCartDetails, updateCart, clearCart, createOrder, orderDetails, newPayment, statusCheck }

