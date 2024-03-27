const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser')
const { getUserDetails, addAddress, uploadImg } = require('../controllers/userController');



router.get('/details', verifyUser, getUserDetails);

router.post('/addaddress', verifyUser, addAddress);

router.post('/uploadimg', verifyUser, uploadImg);

module.exports = router;
