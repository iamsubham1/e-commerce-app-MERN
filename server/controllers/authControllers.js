const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateUniqueOTP, generateJWT } = require("../utility/helperFunctions");

require('dotenv').config();

var otp;
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {

        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
    },
});

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
                phoneNumber: req.body.phoneNumber,
            });

            return res.status(200).json({ success: true, msg: "account created", user });
        }

        //console.log("Account exists. Login instead");
        return res.status(400).json({ error: "account exists" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //console.log("Received login request for email:", email);

        let user = await User.findOne({ email: email });
        //console.log("User found in the database:", user);

        if (user) {
            const passwordCompare = await bcrypt.compare(password, user.password);
            //console.log("Password comparison result:", passwordCompare);

            if (passwordCompare) {
                //console.log("Password is correct. Generating JWT...");


                const token = generateJWT(user);
                res.cookie('Jwt', token, { httpOnly: false });
                return res.status(200).json({ success: true, token, data: user });

            } else {
                //console.log("Incorrect password");
            }

        } else {
            //console.log("User not found");
        }

        return res.status(400).json({ success: false, error: "Enter correct credentials" });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

const sendOtp = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json("No user found");
        }



        otp = generateUniqueOTP();
        const mailOptions = {
            from: `Gadgets Grab <${process.env.GOOGLE_EMAIL}>`,
            to: req.body.email,
            subject: "Password Reset OTP",
            html: `
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Gadgets Grab</a>
                        </div>
                        <p style="font-size:1.1em">Hi,</p>
                        <p>Thank you for choosing Gadgets Grab. Use the following OTP to Reset your password. OTP is valid for 2 minutes</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                        <p style="font-size:0.9em;">Regards,<br />Gadgets Grab</p>
                        <hr style="border:none;border-top:1px solid #eee" />
                        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                            <p>Gadgets Grab Inc</p>
                            <p>Berhampur</p>
                            <p>Odisha</p>
                        </div>
                    </div>
                </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ error: "An error occurred while sending the email" });
            }
            //console.log("Email sent:", info.response);

            // Reset otp after 2 minutes
            setTimeout(() => {
                otp = null;
            }, 120000);
        });

        return res.status(200).json({ message: "OTP sent successfully to", email: req.body.email });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};


const verifyOtp = async (req, res) => {
    try {
        const receivedOtp = req.body.otp;
        //console.log(receivedOtp, otp);
        if (receivedOtp == otp) {

            res.status(200).json("yes it works");
        } else {
            res.status(400).json("entered otp is expired");
        }
    } catch (error) {
        //console.log(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

const resetPassword = async (req, res) => {
    try {

        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const updatePassword = await User.updateOne({ email }, { password: hashedPassword });
        if (updatePassword) {
            res.status(200).json({ message: "Password changed successfully" });
        } else {
            res.status(404).json({ message: "Password not changed" });
        }


    } catch (error) {
        //console.log(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }


}

module.exports = { signUpController, loginController, sendOtp, verifyOtp, resetPassword };







