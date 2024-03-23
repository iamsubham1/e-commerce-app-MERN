const Product = require('../models/ProductModel');



const redisClient = require('../redis')

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity, brand } = req.body;

        const product = new Product({ name, description, price, category, quantity, brand });

        await product.save();

        res.status(201).json(product); // Return the newly created product
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete product by ID
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const searchedProduct = async (req, res) => {
    try {
        const { keyword } = req.params;
        console.log(keyword);
        const products = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllProducts = async (req, res) => {
    try {

        const cache = await redisClient.get('products');
        if (cache) {
            console.log("hit");
            res.status(200).send(cache);
        }
        else {
            console.log("miss");
            const products = await Product.find();

            // Store products in Redis
            redisClient.set('products', JSON.stringify(products), (error, reply) => {
                if (error) {
                    console.error('Error storing products in Redis:', error);
                } else {
                    console.log('Products stored in Redis');
                }
            });

            res.status(200).json(products);
        }

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProductsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;

        const products = await Product.find({ brand: { $regex: new RegExp(brand, 'i') } });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found for the given brand' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const products = await Product.find({ category: { $regex: new RegExp(category, 'i') } });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found for the given category' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = { addProduct, deleteProduct, searchedProduct, getAllProducts, getProductsByBrand, getProductsByCategory };