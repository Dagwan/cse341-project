const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const tasksController = require('../controllers/taskController');
const usersController = require('../controllers/userController');
const authRouter = require('../auth/auth');
const { requiresAuth } = require('express-openid-connect');

// Validation middleware for task ID
const validateTaskId = param('id').isMongoId().withMessage('Invalid task ID format');

// Validation middleware for user ID
const validateUserId = param('id').isMongoId().withMessage('Invalid user ID format');

// Validation middleware for task data
const validateTaskData = [
  body('name').notEmpty().withMessage('Name is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
  body('priority').notEmpty().withMessage('Priority is required'),
  body('completed').isBoolean().withMessage('Completed must be a boolean'),
  body('createdBy')
    .notEmpty()
    .withMessage('CreatedBy is required')
    .isMongoId()
    .withMessage('Invalid createdBy ID format'),
  body('tags').isArray().withMessage('Tags must be an array')
];

// Validation middleware for user data
const validateUserData = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('registrationDate').isISO8601().withMessage('Registration date must be a valid date'),
  body('role').notEmpty().withMessage('Role is required'),
  body('status').notEmpty().withMessage('Status is required')
];

// Error handling middleware for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Task Routes
router.post('/tasks', requiresAuth(), validateTaskData, handleValidationErrors, tasksController.createTask);
router.get('/tasks', requiresAuth(), tasksController.getAllTasks);
router.get('/tasks/:id', requiresAuth(), validateTaskId, handleValidationErrors, tasksController.getSingleTask);
router.put(
  '/tasks/:id',
  requiresAuth(),
  validateTaskId,
  validateTaskData,
  handleValidationErrors,
  tasksController.updateTask
);
router.delete('/tasks/:id', requiresAuth(), validateTaskId, handleValidationErrors, tasksController.deleteTask);

// User Routes
router.post('/users', requiresAuth(), validateUserData, handleValidationErrors, usersController.createUser);
router.get('/users', requiresAuth(), usersController.getAllUsers);
router.get('/users/:id', requiresAuth(), validateUserId, handleValidationErrors, usersController.getSingleUser);
router.put(
  '/users/:id',
  requiresAuth(),
  validateUserId,
  validateUserData,
  handleValidationErrors,
  usersController.updateUser
);
router.delete('/users/:id', requiresAuth(), validateUserId, handleValidationErrors, usersController.deleteUser);

router.use('/auth', authRouter);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { body, validationResult, param } = require('express-validator');
// const tasksController = require('../controllers/taskController');
// const usersController = require('../controllers/userController');
// const authRouter = require('../auth/auth');


// // Validation middleware for task ID
// const validateTaskId = param('id').isMongoId().withMessage('Invalid task ID format');

// // Validation middleware for user ID
// const validateUserId = param('id').isMongoId().withMessage('Invalid user ID format');

// // Validation middleware for task data
// const validateTaskData = [
//   body('name').notEmpty().withMessage('Name is required'),
//   body('title').notEmpty().withMessage('Title is required'),
//   body('description').notEmpty().withMessage('Description is required'),
//   body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
//   body('priority').notEmpty().withMessage('Priority is required'),
//   body('completed').isBoolean().withMessage('Completed must be a boolean'),
//   body('createdBy')
//     .notEmpty()
//     .withMessage('CreatedBy is required')
//     .isMongoId()
//     .withMessage('Invalid createdBy ID format'),
//   body('tags').isArray().withMessage('Tags must be an array')
// ];

// // Validation middleware for user data
// const validateUserData = [
//   body('name').notEmpty().withMessage('Name is required'),
//   body('email').isEmail().withMessage('Invalid email format'),
//   body('username').notEmpty().withMessage('Username is required'),
//   body('password').notEmpty().withMessage('Password is required'),
//   body('registrationDate').isISO8601().withMessage('Registration date must be a valid date'),
//   body('role').notEmpty().withMessage('Role is required'),
//   body('status').notEmpty().withMessage('Status is required')
// ];

// // Error handling middleware for validation errors
// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   next();
// };

// // Task Routes
// router.post('/tasks', validateTaskData, handleValidationErrors, tasksController.createTask);
// router.get('/tasks', tasksController.getAllTasks);
// router.get('/tasks/:id', validateTaskId, handleValidationErrors, tasksController.getSingleTask);
// router.put(
//   '/tasks/:id',
//   validateTaskId,
//   validateTaskData,
//   handleValidationErrors,
//   tasksController.updateTask
// );
// router.delete('/tasks/:id', validateTaskId, handleValidationErrors, tasksController.deleteTask);

// // User Routes
// router.post('/users', validateUserData, handleValidationErrors, usersController.createUser);
// router.get('/users', usersController.getAllUsers);
// router.get('/users/:id', validateUserId, handleValidationErrors, usersController.getSingleUser);
// router.put(
//   '/users/:id',
//   validateUserId,
//   validateUserData,
//   handleValidationErrors,
//   usersController.updateUser
// );
// router.delete('/users/:id', validateUserId, handleValidationErrors, usersController.deleteUser);

// router.use('/auth', authRouter); 

// module.exports = router;