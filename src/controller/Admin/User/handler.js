'use strict';

let express = require('express');
let router = express.Router();
const auth = require('../../Auth/authorizer');
const { paginate } = require('./user.controller');

router.use(auth.verify);
router.post('/').use('/paginate', paginate);
// router.put('/').use('/update/:id', updateEvent);
// router.get('/').use('/eventDetails/:id', eventDetails);

module.exports = router;
