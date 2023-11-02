const swaggerAutogen = require('swagger-autogen')();
require('./models/taskModel');
require('./models/userModel');

const doc = {
  info: {
    title: 'Task Management API',
    description: 'API documentation for the Tasks API. This API is designed to help you efficiently manage your Tasks information...',
    version: '1.0.0',
  },
  host: 'cse341-project-gqaa.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    Auth0: {
      type: 'oauth2',
      authorizationUrl: 'https://dev-8m28xtltvhrq4ad4.us.auth0.com/authorize',
      tokenUrl: 'https://dev-8m28xtltvhrq4ad4.us.auth0.com/oauth/token',
      flow: 'implicit',
      scopes: {
        openid: 'OpenID Connect',
        profile: 'Access user profile',
      },
      redirect_uri: 'https://cse341-project-gqaa.onrender.com/callback',
    },
  },
  
  security: [{ Auth0: ['openid', 'profile'] }], // Global security requirement for all endpoints
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
        auth0Id: { type: 'string' }, 
        displayName: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        image: { type: 'string' },
        createdAt: { type: 'string' },
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
    '/auth/login': {
      get: {
        summary: 'Authenticate with Auth0',
        description: 'Initiate Auth0 authentication.',
        responses: {
          200: {
            description: 'Successfully initiated OAuth authentication',
          },
        },
      },
    },
    '/auth/logout': {
      get: {
        summary: 'OAuth Callback',
        description: 'Callback for Auth0 authentication.',
        responses: {
          200: {
            description: 'Callback for Auth0 authentication',
          },
        },
      },
    },
    '/users/login': {
      post: {
        summary: 'User login',
        description: 'Authenticate a user with username and password.',
        responses: {
          200: {
            description: 'User authenticated successfully',
            schema: {
              $ref: '#/definitions/AuthResponse',
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
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

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

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
//         status: { type: 'string' },
//         auth0Id: { type: 'string' }, 
//         displayName: { type: 'string' },
//         firstName: { type: 'string' },
//         lastName: { type: 'string' },
//         image: { type: 'string' },
//         createdAt: { type: Date}
//       }
//     },
//     AuthRequest: {
//       type: 'object',
//       properties: {
//         username: { type: 'string' },
//         password: { type: 'string' }
//       }
//     },
//     AuthResponse: {
//       type: 'object',
//       properties: {
//         token: { type: 'string' }
//       }
//     }
//   },
//   paths: {
//     '/auth/login': {
//       get: {
//         summary: 'Authenticate with Auth0',
//         description: 'Initiate  Auth0 authentication.',
//         responses: {
//           200: {
//             description: 'Successfully initiated  OAuth authentication'
//           }
//         }
//       }
//     },
//     '/auth/logout': {
//       get: {
//         summary: ' OAuth Callback',
//         description: 'Callback for  Auth0 authentication.',
//         responses: {
//           200: {
//             description: 'Callback for  Auth0 authentication'
//           }
//         }
//       }
//     },
//     '/users/profile': {
//       post: {
//         summary: 'Create a new user',
//         description: 'Register a new user in the system.',
//         responses: {
//           201: {
//             description: 'User created successfully',
//             schema: {
//               $ref: '#/definitions/AuthResponse'
//             }
//           },
//           400: {
//             description: 'Bad request or user already exists'
//           },
//           500: {
//             description: 'Internal server error'
//           }
//         },
//         parameters: [
//           {
//             in: 'body',
//             name: 'user',
//             required: true,
//             schema: {
//               $ref: '#/definitions/User'
//             }
//           }
//         ]
//       }
//     },
//     '/users/login': {
//       post: {
//         summary: 'User login',
//         description: 'Authenticate a user with username and password.',
//         responses: {
//           200: {
//             description: 'User authenticated successfully',
//             schema: {
//               $ref: '#/definitions/AuthResponse'
//             }
//           },
//           401: {
//             description: 'Unauthorized'
//           },
//           500: {
//             description: 'Internal server error'
//           }
//         },
//         parameters: [
//           {
//             in: 'body',
//             name: 'authRequest',
//             required: true,
//             schema: {
//               $ref: '#/definitions/AuthRequest'
//             }
//           }
//         ]
//       }
//     }
//   }
// };

// const outputFile = './swagger.json';
// const endpointsFiles = ['./routes/index.js'];

// swaggerAutogen(outputFile, endpointsFiles, doc);
// console.log('Swagger runs successfully');
