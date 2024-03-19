const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['Task Creation', 'Task Update', 'Task Deletion', 'Project Update', 'Comment'],
    required: true
  }
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
