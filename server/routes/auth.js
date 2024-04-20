const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel');
require('dotenv').config();
const { signUpController, loginController, sendOtp, verifyOtp, resetPassword } = require('../controllers/authControllers');
const { generateJWT } = require('../utility/helperFunctions');


// Initialize Passport with Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRECT,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in the database
            console.log(profile);
            let user = await User.findOne({ email: profile.emails[0].value });


            if (!user) {
                // If user doesn't exist, create a new user
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,

                });
            }

            // Pass user to the next middleware
            done(null, user);

        } catch (error) {
            done(error);
        }
    }
));



// Route for Google OAuth authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after successful Google OAuth authentication
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-failure' }),
    (req, res) => {
        // Successful authentication, generate JWT and send it back to the client
        const token = generateJWT(req.user);
        res.cookie('JWT', token, { httpOnly: false, secure: true, sameSite: 'none' });

        res.redirect('http://localhost:5173/googleloginnextstep');


    }
);
router.post('/signup', signUpController);
router.post('/login', loginController);
router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);
router.patch('/changepassword', resetPassword);

module.exports = router;
