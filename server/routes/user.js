const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser')
const { getUserDetails, addAddress } = require('../controllers/userController');



router.get('/details', verifyUser, getUserDetails);

router.post('/addaddress', verifyUser, addAddress);


module.exports = router;
