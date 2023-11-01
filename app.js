const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/db');
const authRouter = require('./auth/auth');
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

// Enable CORS for origins
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Use routes defined in separate files
app.use('/', require('./routes'));

// Use the authRouter middleware
app.use('/login', authRouter);

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
