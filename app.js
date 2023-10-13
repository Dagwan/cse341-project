const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/db');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // Add this line
require('dotenv').config();
require('./auth/google-auth');

const port = process.env.PORT || 8080;
const app = express();

// Enable CORS for specific origins
const corsOptions = {
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Middleware for setting CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Initialize Passport middleware
app.use(passport.initialize());

// Use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// Use Passport session middleware after express-session
app.use(passport.session());

// Use routes defined in separate files
app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error('Error initializing database:', err);
  } else {
    app.listen(port, () => {
      console.log(`Running and listening on Port ${port}`);
      console.log('Database successfully initialize');
    });
  }
});