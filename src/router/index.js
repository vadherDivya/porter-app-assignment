'use strict';

let express = require('express');
var cors = require('cors');

let router = express.Router();

const AuthRoute = require('./Auth/AuthRouter');
const RideRoute = require("./Ride/RideRoute");

router.post('/').use('/auth', AuthRoute);
router.post('/').use('/ride', RideRoute);

router.get('/').use('/test', itworks);

router.all('*', (req, res) => {
    res.status(502).send('BAD_GATEWAY');
});

async function itworks(req, res) {
    console.log('password', process.env.DB_HOST);
    return res.send({
        name: 'API',
        status: 'IT_WORKS',
        message: 'No, this is not the correct basePath!',
        PROJECT_NAME: 'assignment-Porter-App-platform',
    });
}

module.exports = router;
