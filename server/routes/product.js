const express = require('express');
const router = express.Router();
const { addProduct, deleteProduct, searchedProduct, getAllProducts, getProductsByBrand, getProductsByCategory, getProductDetails } = require('../controllers/productControllers');




const verifyUser = require('../middleware/verifyUser')





router.post('/addproduct', addProduct);

router.delete('/deleteproduct/:productId', deleteProduct);

router.get('/allproducts', verifyUser, getAllProducts);
router.get('/productdetails/:productId', verifyUser, getProductDetails);

router.post('/search/:keyword', verifyUser, searchedProduct);
router.get('/brand/:brand', verifyUser, getProductsByBrand);
router.get('/category/:category', verifyUser, getProductsByCategory);

module.exports = router;