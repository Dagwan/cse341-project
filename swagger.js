const swaggerAutogen = require('swagger-autogen')();
require('./models/taskModel');
require('./models/userModel');

const doc = {
  info: {
    title: 'Task Management API',
    description:
      'API documentation for the Tasks API. This API is designed to help you efficiently manage your Tasks information...',
    version: '1.0.0',
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
        tags: { type: 'array', items: { type: 'string' } },
      },
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
        status: { type: 'string' },
      },
    },
    AuthRequest: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
    AuthResponse: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  },
  paths: {
    '/auth/google': {
      get: {
        summary: 'Authenticate with Google',
        responses: {
          '200': {
            description: 'Successfully initiated Google OAuth authentication',
          },
        },
      },
    },
    '/auth/google/callback': {
      get: {
        summary: 'Google OAuth Callback',
        responses: {
          '200': {
            description: 'Callback for Google OAuth authentication',
          },
        },
      },
    },
    '/users/create': {
      post: {
        summary: 'Create a new user',
        responses: {
          '201': {
            description: 'User created successfully',
            schema: {
              $ref: '#/definitions/AuthResponse',
            },
          },
          '400': {
            description: 'Bad request or user already exists',
          },
          '500': {
            description: 'Internal server error',
          },
        },
        parameters: [
          {
            in: 'body',
            name: 'user',
            required: true,
            schema: {
              $ref: '#/definitions/User',
            },
          },
        ],
      },
    },
    '/users/login': {
      post: {
        summary: 'User login',
        responses: {
          '200': {
            description: 'User authenticated successfully',
            schema: {
              $ref: '#/definitions/AuthResponse',
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '500': {
            description: 'Internal server error',
          },
        },
        parameters: [
          {
            in: 'body',
            name: 'authRequest',
            required: true,
            schema: {
              $ref: '#/definitions/AuthRequest',
            },
          },
        ],
      },
    },
  },
};

// Corrected path
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
console.log('Swagger runs successfully');










// const swaggerAutogen = require('swagger-autogen')();
// require('./models/taskModel');
// require('./models/userModel');

// const doc = {
//   info: {
//     title: 'Task Management API',
//     description:
//       'API documentation for the Tasks API. This API is designed to help you efficiently manage your Tasks information...',
//     version: '1.0.0'
//   },
//   host: 'cse341-project-gqaa.onrender.com',
//   schemes: ['https'],
//   definitions: {
//     Task: {
//       type: 'object',
//       properties: {
//         name: { type: 'string' },
//         title: { type: 'string' },
//         description: { type: 'string' },
//         dueDate: { type: 'string' },
//         priority: { type: 'string' },
//         completed: { type: 'boolean' },
//         createdBy: { type: 'string' },
//         tags: { type: 'array', items: { type: 'string' } }
//       }
//     },
//     User: {
//       type: 'object',
//       properties: {
//         name: { type: 'string' },
//         email: { type: 'string' },
//         username: { type: 'string' },
//         password: { type: 'string' },
//         registrationDate: { type: 'string' },
//         role: { type: 'string' },
//         status: { type: 'string' }
//       }
//     }
//   }
// };

// const outputFile = './swagger.json';
// const endpointsFiles = ['./routes/index.js'];

// // generate swagger.json
// swaggerAutogen(outputFile, endpointsFiles, doc);
// console.log('Swagger runs successfully');

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
