const express = require('express');
const router = express.Router();
const { signUpController } = require('../controllers/authControllers');



router.post('/signup', signUpController);
// router.options('login', loginController);


module.exports = router;