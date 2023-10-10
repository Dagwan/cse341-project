const { ObjectId } = require('mongodb');
const mongodb = require('../db/db');

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
      createdBy: req.body.createdBy, // Assuming this is a valid ObjectId for the user who created the task
      tags: req.body.tags
    };

    // Insert the task into the MongoDB collection
    const result = await mongodb.getDb().db().collection('tasks').insertOne(taskData);

    if (result.insertedId) {
      res.status(201).json({ success: 'Task created successfully', taskId: result.insertedId });
    } else {
      res.status(500).json({ error: 'An error occurred while creating the task.' });
    }
  } catch (error) {
    console.error('Error creating a task:', error);
    res.status(500).json({ error: 'An error occurred while creating the task.' });
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
  deleteTask
};
