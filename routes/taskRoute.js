const express = require('express');
const router = express.Router();
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const tasksController = require('../controllers/taskController');
const usersController = require('../controllers/userController');

// Task Routes
router.post('/tasks', [
  // Validation middleware using express-validator for task creation
  body('name').notEmpty().withMessage('Name is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Due date must be a valid date'),
  body('priority').notEmpty().withMessage('Priority is required'),
  body('completed').isBoolean().withMessage('Completed must be a boolean'),
  body('createdBy').notEmpty().withMessage('CreatedBy is required').isMongoId().withMessage('Invalid createdBy ID format'),
  body('tags').isArray().withMessage('Tags must be an array'),
  // Error handling middleware for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, proceed to create the task
    return next();
  },
  tasksController.createTask, // Call the controller method to create a task
]);

router.get('/tasks', tasksController.getAllTasks);
router.get('/tasks/:id', tasksController.getSingleTask);
router.put('/tasks/:id', tasksController.updateTask);
router.delete('/tasks/:id', tasksController.deleteTask);

// User Routes
router.post('/users', [
  // Validation middleware using express-validator for user creation
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('registrationDate').isISO8601().withMessage('Registration date must be a valid date'),
  body('role').notEmpty().withMessage('Role is required'),
  body('status').notEmpty().withMessage('Status is required'),
  // Error handling middleware for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, proceed to create the user
    return next();
  },
  usersController.createUser, // Call the controller method to create a user
]);

router.get('/users', usersController.getAllUsers);
router.get('/users/:id', usersController.getSingleUser);
router.put('/users/:id', usersController.updateUser);
router.delete('/users/:id', usersController.deleteUser);

// Protect a route with Google OAuth authentication
router.get('/project', passport.authenticate('google'), (req, res) => {
  // This route is protected and can only be accessed by authenticated Google users
  res.json({ message: 'Protected route accessed successfully' });
});

module.exports = router;

























// // Import passport module
// const express = require('express');
// const router = express.Router();
// const passport = require('passport');

// // Import user controller, not task controller
// const tasksController = require('../controllers/taskController');
// const usersController = require('../controllers/userController');

// // Task Routes
// router.post('/tasks', tasksController.createTask);
// router.get('/tasks', tasksController.getAllTasks);
// router.get('/tasks/:id', tasksController.getSingleTask);
// router.put('/tasks/:id', tasksController.updateTask);
// router.delete('/tasks/:id', tasksController.deleteTask);

// // User Routes
// router.post('/users', usersController.createUser);
// router.get('/users', usersController.getAllUsers);
// router.get('/users/:id', usersController.getSingleUser);
// router.put('/users/:id', usersController.updateUser);
// router.delete('/users/:id', usersController.deleteUser);

// // Protect a route with Google OAuth authentication
// router.get('/project', passport.authenticate('google'), (req, res) => {
//   // This route is protected and can only be accessed by authenticated Google users
//   res.json({ message: 'Protected route accessed successfully' });
// });

// module.exports = router;
