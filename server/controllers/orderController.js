const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const { calculateTotalPrice } = require('../utility/helperFunctions');
const redisClient = require('../redis');





const addtocart = async (req, res) => {

    try {
        const { productId, quantity } = req.body;
        console.log(req.body);

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

        console.log(shoppingCart);
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
    const generateFakeTransactionId = () => {
        return 'fake_txn_' + Math.random().toString(36);
    };

    try {
        const userId = req.user._id;
        const products = req.body.products;
        console.log(products);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("User not found");
        } else {
            // Calculate total price based on the product prices and quantities in the cart
            const totalPrice = await calculateTotalPrice(products);

            // Make payment and get transaction ID
            const transactionId = generateFakeTransactionId();

            // Create the order
            const order = new Order({
                userId,
                products: products,
                totalPrice,
                transactionId,
                status: 'pending'
            });

            // Save the order to the database
            await order.save();
            user.orders.push(order._id);
            await user.save();

            // Reduce the quantity of products from the inventory according to the order quantity

            for (let i = 0; i < products.length; i++) {
                const { productId, quantity } = products[i];
                const product = await Product.findById(productId, '_id quantity');

                if (product) {
                    product.quantity -= quantity;

                    // Save updated product quantity to MongoDB
                    await product.save();
                    console.log(product);

                    // Update Redis cache for product quantity
                    try {
                        const reply = await redisClient.get('products');
                        const productsArray = JSON.parse(reply);
                        console.log(productsArray);

                        const updatedProducts = productsArray.map(product => {
                            if (product._id === productId) {
                                product.quantity -= quantity;
                                console.log(`Updated quantity for product ${productId}: ${product.quantity}`);
                            }
                            return product;
                        });

                        await redisClient.set('products', JSON.stringify(updatedProducts));
                        console.log('Products array updated in Redis');
                    } catch (error) {
                        console.error('Error updating products array in Redis:', error);
                    }


                }
                return res.status(201).json({ message: 'Order created successfully', order });
            }
        }
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

}


const paymentHandler = async (req, res) => {

}

module.exports = { addtocart, getCartDetails, updateCart, clearCart, createOrder, orderDetails }

