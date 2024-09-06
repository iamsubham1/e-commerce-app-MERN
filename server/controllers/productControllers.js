const Product = require('../models/ProductModel');

const redisClient = require('../redis');

// need to add redis in add product and delete products

//add product to shop
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

//delete product from shop
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

//search product by name or desciption
const searchedProduct = async (req, res) => {
    try {
        const { keyword } = req.params;

        if (!keyword || keyword.trim() === '') {
            return res.status(400).json({ error: 'Keyword parameter is required and cannot be empty' });
        }

        console.log("API hit");

        // Check if the result is cached in Redis
        const cacheKey = `products:${keyword.toLowerCase()}`;
        const cache = await redisClient.get(cacheKey);

        if (cache) {
            console.log('Result found in cache');
            const products = JSON.parse(cache);

            // Filter products based on keyword
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(keyword.toLowerCase()) ||
                product.description.toLowerCase().includes(keyword.toLowerCase()) ||
                product.category.toLowerCase().includes(keyword.toLowerCase())
            );

            if (filteredProducts.length > 0) {
                return res.status(200).json({
                    message: 'Products found in cache',
                    data: filteredProducts
                });
            } else {
                return res.status(200).json({
                    message: 'No products found matching the keyword',
                    data: []
                });
            }
        } else {
            console.log('Cache miss, querying database');
            const products = await Product.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } }
                ]
            });

            if (products.length > 0) {
                // Cache the result for future searches
                await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 3600); // Cache for 1 hour

                return res.status(200).json({
                    message: 'Products found and cached',
                    data: products
                });
            } else {
                return res.status(200).json({
                    message: 'No products found matching the keyword',
                    data: []
                });
            }
        }
    } catch (err) {
        console.error('Error searching for products:', err);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred while searching for products'
        });
    }
};



const getProductDetails = async (req, res) => {
    try {

        const { productId } = req.params;
        console.log("productId :", productId);
        const details = await Product.findById(productId);
        if (details) {
            const data = await details.populate('reviews');
            res.status(200).json(data);
        } else {
            res.status(400).json({ msg: "product not found" });
        }

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
//get all avalabile products(redis added)
const getAllProducts = async (req, res) => {
    try {
        //check in redisCache

        const cache = await redisClient.get('products');
        if (cache) {
            const products = JSON.parse(cache);
            console.log("cache hit");
            res.status(200).send(products);
        }
        else {
            console.log("miss");
            const products = await Product.find().populate('reviews');

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

//get products by brands
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

//get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        // Check if products exist in Redis cache
        const cachedProducts = await redisClient.get('products:' + category);

        if (cachedProducts) {
            console.log('Products found in Redis cache');
            const parsedCachedProducts = JSON.parse(cachedProducts);
            const filteredProducts = parsedCachedProducts.filter(product => product.category.toLowerCase().includes(category.toLowerCase()));
            return res.status(200).json(filteredProducts);
        } else {
            console.log('Cache miss, querying database');
            const products = await Product.find({ category: { $regex: new RegExp(category, 'i') } });

            if (!products || products.length === 0) {
                return res.status(404).json({ error: 'No products found for the given category' });
            }

            // Cache the fetched products in Redis
            await redisClient.set('products:' + category, JSON.stringify(products));

            console.log('Products fetched from database and cached in Redis');
            return res.status(200).json(products);
        }
    } catch (error) {
        console.error('Error searching for products by category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { addProduct, deleteProduct, searchedProduct, getAllProducts, getProductsByBrand, getProductsByCategory, getProductDetails };