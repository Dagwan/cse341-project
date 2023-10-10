const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  username: String,
  password: String,
  registrationDate: Date,
  role: String,
  status: String
});

module.exports = mongoose.model('users', userSchema);
