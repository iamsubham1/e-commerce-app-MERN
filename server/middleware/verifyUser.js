const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyUser = (req, res, next) => {
    const token = req.header('JWT');

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);


        req.user = userData;
        // console.log((req.user._id));

        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

module.exports = verifyUser;
