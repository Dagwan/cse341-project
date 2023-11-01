const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const Users = require('../models/userModel'); // Import your userModel
const mongoose = require('mongoose');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.CLIENT_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

const authRouter = express.Router();

authRouter.use(auth(config));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB successfully.');

  authRouter.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'User authenticated' : 'User Logged out');
  });

  authRouter.get('/profile', requiresAuth(), async (req, res) => {
    // Get user information from req.oidc.user
    const userInfo = req.oidc.user;

    // Create or update the user in the database based on the Auth0 user ID (sub)
    try {
      const existingUser = await Users.findOne({ auth0Id: userInfo.sub });

      if (existingUser) {
        // Update user data
        existingUser.displayName = userInfo.name;
        existingUser.firstName = userInfo.given_name;
        existingUser.lastName = userInfo.family_name;
        existingUser.image = userInfo.picture;
        existingUser.email = userInfo.email;

        await existingUser.save();
      } else {
        // Create a new user in the database
        const newUser = new Users({
          auth0Id: userInfo.sub,
          displayName: userInfo.name,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          image: userInfo.picture,
          email: userInfo.email
        });

        await newUser.save();
      }

      res.status(200).json({ message: 'Authentication successful' }); // Send the user's info back as a response
    } catch (error) {
      console.error('Error saving user data to the database:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = authRouter;

