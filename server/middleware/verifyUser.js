const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyUser = (req, res, next) => {
    const token = req.header('JWT');
    console.log("------------------------------------------> in middleware", token);
    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        console.log(userData);


        req.user = userData;

        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

module.exports = verifyUser;
