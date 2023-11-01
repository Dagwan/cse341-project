const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  completed: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  tags: [String]
});

module.exports = mongoose.model('tasks', taskSchema);
