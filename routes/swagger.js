const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Serve Swagger API documentation
router.use('/api-docs', swaggerUi.serve);

// Set up the Swagger UI with the provided documentation
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;
