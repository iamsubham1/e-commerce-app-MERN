const Review = require('../models/ReviewModel');
const Product = require('../models/ProductModel');
const redisClient = require('../redis');

//added redis to update reviews not in update yet
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        // Find the product in the database
        const product = await Product.findById(productId, 'reviews');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a new review
        const review = new Review({ productId, userId, rating, comment });
        await review.save();

        // Update the product document to add the new review's ID
        product.reviews.push(review._id);
        await product.save();

        // Update the cached product in Redis if exists
        const cachedProducts = await redisClient.get('products');
        if (cachedProducts) {
            const products = JSON.parse(cachedProducts);
            const updatedProducts = products.map((cachedProduct) => {
                if (cachedProduct._id === productId) {
                    cachedProduct.reviews.push(review);
                }
                return cachedProduct;
            });
            await redisClient.set('products', JSON.stringify(updatedProducts));
        }

        // Return the updated product document with populated reviews
        const populatedProduct = await product.populate('reviews');
        return res.status(200).json(populatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;

        // Delete the review from the database
        const review = await Review.findByIdAndDelete(reviewId);

        const product = await Product.findOne({ 'reviews': reviewId });

        if (product) {
            // Remove the review object from the reviews array
            product.reviews = product.reviews.filter(review => review._id.toString() !== reviewId);

            await product.save();

            console.log('Review deleted successfully');

            // Update the cached products in Redis if exists
            const cachedProducts = await redisClient.get('products');
            if (cachedProducts) {
                const products = JSON.parse(cachedProducts);
                console.log("products from redis", products)
                const updatedProducts = products.map((cachedProduct) => {
                    if (cachedProduct._id.toString() === product._id.toString()) {
                        console.log("Cached product ID:", cachedProduct._id);
                        console.log("Product ID:", product._id);
                        // Filter out the deleted review from the reviews array
                        cachedProduct.reviews = cachedProduct.reviews.filter(cachedReview => cachedReview._id.toString() !== reviewId);
                    }
                    return cachedProduct;
                });

                await redisClient.set('products', JSON.stringify(updatedProducts));
                console.log('Cached products updated in Redis:', updatedProducts);
            }
        } else {
            console.log('Product not found with review:', reviewId);
        }

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateReview = async (req, res) => {

    try {

        const reviewId = req.params.id;

        const { rating, comment } = req.body;

        const review = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
        if (!review) {
            return res.status(400).json({ message: "review not found" });
        }
        res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { addReview, deleteReview, updateReview };