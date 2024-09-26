'use strict';

let express = require('express');
let RideRoute = express.Router();
const Auth = require('../../controller/Auth/authorizer');
const RideController = require("../../controller/RideController/RideController");

RideRoute.use(Auth.verify);

RideRoute.post('/').use('/createRide', RideController.createNewRide);
RideRoute.post('/').use('/acceptRide/:id', RideController.acceptRide);
RideRoute.get('/').use('/availableRide', RideController.availableRide);
RideRoute.put('/').use('/updateRideStatus/:id', RideController.updateRideStatus);
RideRoute.post('/').use('/getAllRides', RideController.getAllRides);
RideRoute.get('/').use('/getRideById/:id', RideController.rideById);
RideRoute.put('/').use('/completeRide/:id', RideController.rideComplete);

module.exports = RideRoute;