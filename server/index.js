const express = require('express');
const app = express();
const port = 4000;
const connectToMongo = require('./db.js');


const startServer = async () => {
    app.use(express.json());

    await connectToMongo();

    app.get("/health", (req, res) => {
        res.json("health is running");
    });

    // Authentication routes
    app.use('/api/auth', require('./routes/auth.js'));



    app.listen(`${port}`, () => {
        console.log(`server is running on ${port}`)
    })

}


const initializeApp = async () => {

    startServer();
}

initializeApp();

