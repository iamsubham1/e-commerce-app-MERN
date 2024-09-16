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
                let profilePic = {
                    name: 'Google',
                    url: ''
                }; if (profile.photos && profile.photos.length > 0) {
                    profilePic.url = profile._json.picture
                    console.log(profilePic);
                }

                user = await User.create({

                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profilePic
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

        const token = generateJWT(req.user);
        res.cookie('JWT', token, { httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'None', secure: true });
        const encodedToken = encodeURIComponent(token);
        const redirectUrl = `https://gadgetsgrabapp.netlify.app/googleloginnextstep?token=${encodedToken}`;

        // Redirect the user to the constructed URL
        res.redirect(redirectUrl);


    }
);

router.post('/signup', signUpController);
router.post('/login', loginController);
router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);
router.patch('/changepassword', resetPassword);

module.exports = router;
