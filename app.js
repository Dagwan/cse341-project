const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/db');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
require('./auth/google-auth')(passport); 
require('events').EventEmitter.defaultMaxListeners = 15;


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

// Use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
// Initialize Passport middleware
app.use(passport.initialize());

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
      console.log('Database successfully initialized');
    });
  }
});
