const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const mongodb = require('../db/db');

// Validation middleware for task creation
const validateCreateTask = [
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

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new task
const createTask = async (req, res) => {
  try {
    // Extract task data from the request body
    const taskData = {
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      completed: req.body.completed,
      createdBy: req.body.createdBy,
      tags: req.body.tags
    };

    // Insert the task into the MongoDB collection
    const collection = mongodb.getDb().db().collection('tasks');

    // Create unique indexes for createdBy, name, title, and priority
    await collection.createIndex({ createdBy: 1 }, { unique: true });
    await collection.createIndex({ name: 1 }, { unique: true });
    await collection.createIndex({ title: 1 }, { unique: true });
    await collection.createIndex({ priority: 1 }, { unique: true });

    const result = await collection.insertOne(taskData);

    if (result.insertedId) {
      res.status(201).json({ success: 'Task created successfully', taskId: result.insertedId });
    } else {
      res.status(500).json({ error: 'An error occurred while creating the task.' });
    }
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.createdBy) {
        res.status(400).json({ error: 'Task with the same createdBy already exists.' });
      } else if (error.keyPattern.name) {
        res.status(400).json({ error: 'Task with the same name already exists.' });
      } else if (error.keyPattern.title) {
        res.status(400).json({ error: 'Task with the same title already exists.' });
      } else if (error.keyPattern.priority) {
        res.status(400).json({ error: 'Task with the same priority already exists.' });
      } else {
        res.status(500).json({ error: 'An error occurred while creating the task.' });
      }
    } else {
      console.error('Error creating a task:', error);
      res.status(500).json({ error: 'An error occurred while creating the task.' });
    }
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await mongodb.getDb().db().collection('tasks').find().toArray();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ error: 'An error occurred while fetching all tasks.' });
  }
};

// Get a single task by ID
const getSingleTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format.' });
    }

    const task = await mongodb
      .getDb()
      .db()
      .collection('tasks')
      .findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching a single task by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the task.' });
  }
};

// Update an existing task by ID
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = {
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      completed: req.body.completed,
      createdBy: req.body.createdBy,
      tags: req.body.tags
    };

    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format.' });
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection('tasks')
      .updateOne({ _id: new ObjectId(taskId) }, { $set: taskData });

    if (result.matchedCount > 0) {
      res.status(200).json({ success: 'Task updated successfully' });
    } else {
      return res.status(404).json({ error: 'Task not found.' });
    }
  } catch (error) {
    console.error('Error updating a task by ID:', error);
    res.status(500).json({ error: 'An error occurred while updating the task.' });
  }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format.' });
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection('tasks')
      .deleteOne({ _id: new ObjectId(taskId) });

    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      return res.status(404).json({ error: 'Task not found.' });
    }
  } catch (error) {
    console.error('Error deleting a task by ID:', error);
    res.status(500).json({ error: 'An error occurred while deleting the task.' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  validateCreateTask, // Export the validation middleware
  handleValidationErrors // Export the error handling middleware
};
