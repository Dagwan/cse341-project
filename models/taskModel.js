const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  completed: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Reference to the user who created the task
  tags: [String]
});

module.exports = mongoose.model('tasks', taskSchema);
