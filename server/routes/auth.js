const express = require('express');
const router = express.Router();
const { signUpController, loginController } = require('../controllers/authControllers');



router.post('/signup', signUpController);

router.post('/login', loginController);
module.exports = router;