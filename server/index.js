const express = require('express');
const app = express();
const port = 4000;
const connectToMongo = require('./db.js');

//health api

const startServer = async () => {

    await connectToMongo();
    app.get("/health", (req, res) => {
        res.json("health is running");
    })


    app.listen(`${port}`, () => {
        console.log(`server is running on ${port}`)
    })


}


const initializeApp = async () => {

    startServer();
}

initializeApp();

