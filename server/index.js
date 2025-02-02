const express = require('express');
const app = express();
const passport = require('passport');

const connectToMongo = require('./db.js');

const connectToRedis = require('./redis.js');
require('dotenv').config()
const port = process.env.PORT;
const cors = require('cors');
const session = require('express-session');
const User = require('./models/UserModel.js');
const cookieParser = require('cookie-parser');

const allowedOrigins = [
    'http://localhost:5173',
    'https://gadgetsgrabapp.netlify.app',

];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);  // Origin is allowed
        } else {
            callback(new Error('Not allowed by CORS'));  // Origin is not allowed
        }
    },
    allowedHeaders: ['Content-Type', 'JWT'],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use(cookieParser()); // Use cookie-parser middleware
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration (serialization and deserialization)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

const startServer = async () => {
    try {
        app.use(express.json());

        app.get("/health", (req, res) => {
            res.json("health is running ok");
        });

        // Authentication routes
        app.use('/api/auth', require('./routes/auth.js'));

        // Product routes
        app.use('/api/product', require('./routes/product.js'));

        app.use('/api/order', require('./routes/order.js'));

        app.use('/api/review', require('./routes/review.js'));

        app.use('/api/user', require('./routes/user.js'));

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

const initializeApp = async () => {


    //await connectToRedis.connect();

    await connectToMongo();

    await startServer();


};

initializeApp();
