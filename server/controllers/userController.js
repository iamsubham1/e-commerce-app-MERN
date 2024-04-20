const User = require("../models/UserModel");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require('sharp');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require('dotenv').config();

const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const bucketAccessKey = process.env.S3_BUCKET_ACCESSKEY;
const bucketSecretKey = process.env.S3_BUCKET_SECRETKEY;


const s3 = new S3Client({
    credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey
    },
    region: bucketRegion
});

const getUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (user) {
            await user.populate('orders');

            //check profile name else aws will throw error
            if (user.profilePic.name) {
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: user.profilePic.name
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command);

                user.profilePic.url = url;


                await user.save();

            }

            user.password = null;

            return res.status(200).send(user);
        }
        return res.status(400).send("No user found");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

const editUserDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        console.log(updatedUser);
        return res.status(200).send(updatedUser);


    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;

        const { streetname,
            landmark,
            city,
            state,
            pincode,
            type } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).send("No user found");
        }

        // Check if the type already exists in the user's address array
        const typeExists = user.address.some(address => address.type === type);
        if (typeExists) {
            return res.status(400).send("Address type already exists");
        }

        user.address.push({
            streetname,
            landmark,
            city,
            state,
            pincode,
            type
        });

        await user.save();
        user.password = null;
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};

//can be optimized 
const updateAddress = async (req, res) => {
    try {

        const userid = req.user._id;

        const addressId = req.params.id;

        const { streetname,
            landmark,
            city,
            state,
            pincode,
            type } = req.body;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(400).json({ message: "user not found" });

        }
        // Find the index of the address in the user's addresses array
        const addressIndex = user.address.findIndex(addres => addres._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }


        const addressToUpdate = user.address[addressIndex];
        if (streetname) addressToUpdate.streetname = streetname;
        if (landmark) addressToUpdate.landmark = landmark;
        if (city) addressToUpdate.city = city;
        if (state) addressToUpdate.state = state;
        if (pincode) addressToUpdate.pincode = pincode;
        if (type) addressToUpdate.type = type;

        // Save the updated user object
        await user.save();

        return res.status(200).json({ message: "Address updated successfully", user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.id;
        const user = await User.findByIdAndUpdate(
            userId,
            //pull address where _id = addressid
            { $pull: { address: { _id: addressId } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = null;
        res.status(200).json({ message: "Address deleted successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const uploadImg = async (req, res) => {
    try {
        const randomNumber = Math.floor(Math.random() * Math.pow(2, 40));
        const imageName = randomNumber.toString(16).padStart(10, '0');

        upload.single('image')(req, res, async () => {
            const userid = req.user._id;
            const user = await User.findById(userid);

            const buffer = await sharp(req.file.buffer)
                .resize({ height: 500, width: 500, fit: "contain" })
                .toBuffer();

            const params = {
                Bucket: bucketName,
                Key: imageName,
                Body: buffer,
                ContentType: req.file.mimetype
            };

            const command = new PutObjectCommand(params);

            try {
                await s3.send(command);
                user.profilePic.name = imageName;
                await user.save();

                res.status(200).send({ message: "Image uploaded successfully", user });
            } catch (error) {
                res.status(500).send({ error: "Failed to upload image to S3", details: error });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};



module.exports = { getUserDetails, addAddress, uploadImg, deleteAddress, updateAddress, editUserDetails };