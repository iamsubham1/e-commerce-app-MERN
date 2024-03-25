const express = require('express');
const router = express.Router();
const { addProduct, deleteProduct, searchedProduct, getAllProducts, getProductsByBrand, getProductsByCategory } = require('../controllers/productControllers');
const verifyUser = require('../middleware/verifyUser')
router.post('/addproduct', addProduct);

router.delete('/deleteproduct/:productId', deleteProduct);

router.get('/allproducts', verifyUser, getAllProducts);

router.post('/search/:keyword', searchedProduct);
router.get('/brand/:brand', getProductsByBrand);
router.get('/category/:category', getProductsByCategory);

module.exports = router;