const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser')
const { getUserDetails, addAddress, uploadImg, deleteAddress, updateAddress } = require('../controllers/userController');



router.get('/details', verifyUser, getUserDetails);

router.post('/addaddress', verifyUser, addAddress);

router.post('/uploadimg', verifyUser, uploadImg);

router.delete('/deleteaddress/:id', verifyUser, deleteAddress);

router.patch('/updateaddress/:id', verifyUser, updateAddress);


module.exports = router;
