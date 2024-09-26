"use strict";

const express = require("express");
const http = require('http');
const app = express();
const server = http.createServer(app);
const multer = require("multer");
const path = require("path");
require('dotenv').config();

const cors = require("cors");
const bodyParser = require("body-parser");
const connectToDb = require("./src/helper/connectToDb.helper");
const PORT = process.env.PORT || 3000;
const projectRoot = path.join(__dirname, "..");

const socketConnection = require("./src/helper/socket/socketConnection");

// Ensure all required config variables are loaded
if (!PORT) {
    throw new Error('Missing required environment variable PORT');
}

// Start Server
module.exports.startServer = async () => {
    try {
        // connect to database
        await connectToDb();

        // body-parser needed to parse form-data bodies
        app.use(bodyParser.json({ limit: "100mb" }));
        app.use(
            bodyParser.urlencoded({
                extended: true,
                limit: "100mb",
                parameterLimit: 100000,
            })
        );

        // Disable x-powered-by header
        app.disable("x-powered-by");

        // Handle `OPTIONS` request.
        app.all("*", handleOptions);

        // enabling CORS for all routes.
        app.use(cors({
            origin: '*'
        }));
        app.use(
            `/resources`,
            express.static(path.join(projectRoot, "resources"))
        );
        app.use(`/public`, express.static(path.join(__dirname, 'public')));

        app.get('/', (req, res) => {
            res.send('Hello world!')
        });
        app.get('/status', (req, res) => {
            res.send('ok')
        });
        app.get('/test', (req, res) => {
            res.send('server working')
        });

        // load routes
        app.use(express.json());
        const router = require("./src/router");
        app.use("/", router);

        // Initialize socket connection
        socketConnection.initialize(server);

        // Listen on the specified port
        await listen();

    } catch (error) {
        console.error("Error starting server:", error);
    }
};

async function listen() {
    server.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    }).on('error', (err) => {
        console.error("Server error:", err);
    });
}

async function handleOptions(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,DELETE,OPTIONS,PATCH"
    );
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language"
    );

    if (req.method === "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
}

async function deleteCacheHeaders(req, res, next) {
    req.headers["if-none-match"] = "";
    req.headers["if-modified-since"] = "";
    res.header("Access-Control-Expose-Headers", "Content-Disposition");
    next();
}

// General error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
