const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contact API',
    description:
      'API documentation for the Tasks API. This API is designed to help you efficiently manage your Tasks information...',
    version: '1.0.0'
  },
  host: 'localhost:8080',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
console.log('Swagger runs successfully');
