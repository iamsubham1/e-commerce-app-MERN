const express = require('express');
const router = express.Router();

const { signUpController, loginController, sendOtp, verifyOtp, resetPassword } = require('../controllers/authControllers');



router.post('/signup', signUpController);

router.post('/login', loginController);

router.post('/sendotp', sendOtp);

router.post('/verifyotp', verifyOtp);

router.patch('/changepassword', resetPassword);


module.exports = router;