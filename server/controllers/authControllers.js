const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//signup controller 
const signUpController = async (req, res) => {


    try {
        const email = req.body.email;
        const user = await User.findOne(email);
        if (!user) {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
                phoneNumber: req.body.number,
            })
            return res.status(200).json({ sucess: true, msg: "account created" });




        } console.log("Account exists Login instead");
        return res.status(400).json({ error: "account exists" });

    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send("internal Server error ");
    }
}



module.exports = { signUpController };