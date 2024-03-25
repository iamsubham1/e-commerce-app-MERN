const express = require('express');
const router = express.Router();
const { addtocart, getCartDetails, updateCart, clearCart, createOrder } = require('../controllers/orderController');
const verifyUser = require('../middleware/verifyUser')


router.post('/addtocart', verifyUser, addtocart);

router.get('/cartdetails/:id', verifyUser, getCartDetails);

router.patch('/updatecart', verifyUser, updateCart);
router.delete('/clearcart', verifyUser, clearCart);
router.post('/placeorder', verifyUser, createOrder);
module.exports = router;
