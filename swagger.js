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
      authorizationUrl: 'https://dev-8m28xtltvhrq4ad4.us.auth0.com',
      tokenUrl: 'https://dev-8m28xtltvhrq4ad4.us.auth0.com',
      flow: 'implicit',
      scopes: {
        openid: 'OpenID Connect',
        profile: 'Access user profile',
      },
    },
  },
  security: [{ Auth0: ['openid', 'profile'] }],
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
        security: [{ Auth0: ['openid', 'profile'] }],
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
        security: [{ Auth0: ['openid', 'profile'] }],
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
        security: [],
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
    '/tasks': {
      post: {
        summary: 'Create a new task',
        description: 'Create a new task.',
        responses: {
          201: {
            description: 'Task created successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'body',
            name: 'taskData',
            required: true,
            schema: {
              $ref: '#/definitions/Task',
            },
          },
        ],
      },
      get: {
        summary: 'Get all tasks',
        description: 'Get a list of all tasks.',
        responses: {
          200: {
            description: 'Tasks retrieved successfully',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/Task',
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get a single task',
        description: 'Get a single task by ID.',
        responses: {
          200: {
            description: 'Task retrieved successfully',
            schema: {
              $ref: '#/definitions/Task',
            },
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Task not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
        ],
      },
      put: {
        summary: 'Update a task',
        description: 'Update a task by ID.',
        responses: {
          200: {
            description: 'Task updated successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'Task not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'taskData',
            required: true,
            schema: {
              $ref: '#/definitions/Task',
            },
          },
        ],
      },
      delete: {
        summary: 'Delete a task',
        description: 'Delete a task by ID.',
        responses: {
          204: {
            description: 'Task deleted successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
           404: {
            description: 'Task not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
        ],
      },
    },
    '/users': {
      post: {
        summary: 'Create a new user',
        description: 'Create a new user.',
        responses: {
          201: {
            description: 'User created successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'body',
            name: 'userData',
            required: true,
            schema: {
              $ref: '#/definitions/User',
            },
          },
        ],
      },
      get: {
        summary: 'Get all users',
        description: 'Get a list of all users.',
        responses: {
          200: {
            description: 'Users retrieved successfully',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/User',
              },
            },
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get a single user',
        description: 'Get a single user by ID.',
        responses: {
          200: {
            description: 'User retrieved successfully',
            schema: {
              $ref: '#/definitions/User',
            },
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
        ],
      },
      put: {
        summary: 'Update a user',
        description: 'Update a user by ID.',
        responses: {
          200: {
            description: 'User updated successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'userData',
            required: true,
            schema: {
              $ref: '#/definitions/User',
            },
          },
        ],
      },
      delete: {
        summary: 'Delete a user',
        description: 'Delete a user by ID.',
        responses: {
          204: {
            description: 'User deleted successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          404: {
            description: 'User not found',
          },
          500: {
            description: 'Internal server error',
          },
        },
        security: [{ Auth0: ['openid', 'profile'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
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

