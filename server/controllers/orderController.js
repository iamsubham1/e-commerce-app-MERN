const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const { calculateTotalPrice } = require('../utility/helperFunctions');






const addtocart = async (req, res) => {
    try {
        const { productId, quantity } = req.body; // if no quantity given then 1 
        const userId = req.user._id;

        let shoppingCart = await Cart.findOne({ userId });

        if (!shoppingCart) {
            shoppingCart = new Cart({ userId, items: [], totalValue: 0 });
        }

        const existingItem = shoppingCart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            // If product already exists in the cart, update the quantity
            existingItem.quantity += quantity ? Number(quantity) : 1;
        } else {
            // If product doesn't exist in the cart, add a new item
            shoppingCart.items.push({ productId, quantity: quantity ? Number(quantity) : 1 });
        }

        // Calculate total value of the cart based on product prices
        const totalValue = await calculateTotalPrice(shoppingCart.items);

        // Update the totalValue field of the cart
        shoppingCart.totalValue = totalValue;

        // Save the updated cart
        await shoppingCart.save();
        res.status(200).json({ message: 'Product added to cart successfully', shoppingCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCartDetails = async (req, res) => {
    try {
        const cartId = req.params.id;

        const cartDetails = await Cart.findById(cartId);

        if (cartDetails) {
            //console.log(cartDetails);
            return res.status(200).json(cartDetails);
        } else {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateCart = async (req, res) => {
    try {
        const userId = req.user._id
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the item in the cart
        const cartItem = cart.items.find(item => item.productId.toString() === productId);

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Decrease the quantity of the item by 1
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            // If quantity is already 1, remove the item from the cart
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        }

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Product count decreased successfully", cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const clearCart = async (req, res) => {
    try {
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


//update product quantity in redis too
const createOrder = async (req, res) => {

    const generateFakeTransactionId = () => {
        return 'fake_txn_' + Math.random().toString(36);
    };

    try {
        const userId = req.user._id;
        const products = req.body.products;

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

            //reduce the quantity of products from the inventory according to the order quantity
            for (let i = 0; i < products.length; i++) {
                const { productId, quantity } = products[i];
                const product = await Product.findById(productId, '_id quantity');
                if (product) {
                    product.quantity -= quantity;
                    console.log(product.quantity);
                    await product.save();
                }
            }


            res.status(201).json({ message: 'Order created successfully', order });
        }

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const paymentHandler = async (req, res) => {

}

module.exports = { addtocart, getCartDetails, updateCart, clearCart, createOrder }

