const express = require('express');
const router = express.Router();

// Include the Swagger documentation route
router.use('/', require('./swagger'));

// Include the routes
router.use('/', require('./taskRoute'));

module.exports = router;
