const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//signup controller 
const signUpController = async (req, res) => {


    try {
        const email = req.body.email;
        let user = await User.findOne({ email: email });
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

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email: email });

        if (user) {
            const passwordCompare = bcrypt.compare(password, user.password);
            if (passwordCompare) {
                const data = { user };

                const JWT = jwt.sign(data, "dA&*(&&*S76$##$%&Dj");
                return res.status(200).json({ success: true, JWT });

            } console.log("Incorrect credentials");

        } else {
            console.log("Account not found for number");
        } return res.status(400).json({ success: false, error: "Enter correct credentials" });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }

};


module.exports = { signUpController, loginController };