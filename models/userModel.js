const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String, // For Google OAuth users
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
