const swaggerAutogen = require('swagger-autogen')();
require('./models/taskModel');
require('./models/userModel');

const doc = {
  info: {
    title: 'Task Management API',
    description:
      'API documentation for the Tasks API. This API is designed to help you efficiently manage your Tasks information...',
    version: '1.0.0'
  },
  host: 'cse341-project-gqaa.onrender.com',
  schemes: ['https'],
  definitions: {
    Task: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        dueDate: { type: 'string' },
        priority: { type: 'string' },
        completed: { type: 'boolean' },
        createdBy: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } }
      }
    },
    User: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string' },
        registrationDate: { type: 'string' },
        role: { type: 'string' },
        status: { type: 'string' }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
console.log('Swagger runs successfully');

// const swaggerAutogen = require('swagger-autogen')();

// const doc = {
//   info: {
//     title: 'Task Management API',
//     description:
//       'API documentation for the Tasks API. This API is designed to help you efficiently manage your Tasks information...',
//     version: '1.0.0'
//   },
//   host: 'localhost:8080',
//   schemes: ['http', 'https']
// };

// const outputFile = './swagger.json';
// const endpointsFiles = ['./routes/index.js'];

// // generate swagger.json
// swaggerAutogen(outputFile, endpointsFiles, doc);
// console.log('Swagger runs successfully');
