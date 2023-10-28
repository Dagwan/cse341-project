const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: String,
  email: String,
  username: {
    type: String,
    unique: true
  },
  password: String, // Hashed password
  registrationDate: Date,
  role: String,
  status: String
});
// userSchema.index({ googleId: 1 }, { unique: true });

module.exports = mongoose.model('Users', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: {
//     type: String,
//     unique: true
//   },
//   username: String,
//   password: String,
//   registrationDate: Date,
//   role: String,
//   status: String
// });

// module.exports = mongoose.model('users', userSchema);
