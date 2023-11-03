const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const mongodb = require('../db/db');
const bcrypt = require('bcrypt');


// Validation middleware for user creation
const validateCreateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('registrationDate').isISO8601().withMessage('Registration date must be a valid date'),
  body('role').notEmpty().withMessage('Role is required'),
  body('status').notEmpty().withMessage('Status is required')
];

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new user
const createUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const userData = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      // Hash the password
      password: await bcrypt.hash(req.body.password, 10),
      registrationDate: req.body.registrationDate,
      role: req.body.role,
      status: req.body.status
    };

    // Insert the user into the MongoDB collection
    const collection = mongodb.getDb().db().collection('users');

    // Create unique indexes for email and username
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ username: 1 }, { unique: true });

    const result = await collection.insertOne(userData);

    if (result.insertedId) {
      res.status(201).json({ success: 'User created successfully', userId: result.insertedId });
    } else {
      res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        res.status(400).json({ error: 'A user with the same email already exists.' });
      } else if (error.keyPattern.username) {
        res.status(400).json({ error: 'A user with the same username already exists.' });
      } else {
        res.status(500).json({ error: 'An error occurred while creating the user.' });
      }
    } else {
      console.error('Error creating a user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await mongodb.getDb().db().collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'An error occurred while fetching all users.' });
  }
};

// Get a single user by ID
const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    const user = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching a single user by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
};

// Update an existing user by ID
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      registrationDate: req.body.registrationDate,
      role: req.body.role,
      status: req.body.status
    };

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    // Check if the new email or username already exists
    const existingUser = await mongodb
      .getDb()
      .db()
      .collection('users')
      .findOne({ $or: [{ email: userData.email }, { username: userData.username }] });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res
        .status(400)
        .json({ error: 'A user with the same email or username already exists.' });
    }

    // Update the user in the MongoDB collection
    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: userData });

    if (result.matchedCount > 0) {
      res.status(200).json({ success: 'User updated successfully' });
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error updating a user by ID:', error);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format.' });
    }

    const result = await mongodb
      .getDb()
      .db()
      .collection('users')
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error deleting a user by ID:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  validateCreateUser, // Export the validation middleware
  handleValidationErrors // Export the error handling middleware
};
