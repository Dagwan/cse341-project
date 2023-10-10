// Import passport module
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import user controller, not task controller
const tasksController = require('../controllers/taskController');
const usersController = require('../controllers/userController');

// Task Routes
router.post('/tasks', tasksController.createTask);
router.get('/tasks', tasksController.getAllTasks);
router.get('/tasks/:id', tasksController.getSingleTask);
router.put('/tasks/:id', tasksController.updateTask);
router.delete('/tasks/:id', tasksController.deleteTask);

// User Routes
router.post('/users', usersController.createUser);
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
