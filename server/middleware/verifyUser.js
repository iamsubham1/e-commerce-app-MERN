const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const verifyUser = (req, res, next) => {
    // Extract JWT from the cookie named 'Jwt'
    const token = req.cookies.Jwt || req.header('JWT');


    if (!token) {
        return res.status(401).send({ error: "Authentication token not found" });
    }

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = userData;

        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

module.exports = verifyUser;
