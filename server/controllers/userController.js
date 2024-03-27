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

            // console.log(user.profilePic.name);

            const getObjectParams = {
                Bucket: bucketName,
                Key: user.profilePic.name
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

            user.profilePic.url = url;
            await user.save();


            return res.status(200).send(user);
        }
        return res.status(400).send("No user found");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;

        const { address, type } = req.body;
        const user = await User.findById(userId);
        if (user) {
            console.log(user);
            user.address.push({ address, type });
            await user.save();
            return res.status(200).send(user);
        }

        return res.status(400).send("No user found");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
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
        res.status(500).send({ error: "An error occurred", details: error });
    }
};

module.exports = { getUserDetails, addAddress, uploadImg };