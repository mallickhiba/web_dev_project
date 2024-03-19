const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  email : {type: String, required: true},
  pid: {type: String, required: true, unique: true},
  name: {  
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'}],
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' },
  manager : { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' },
  createdAt: {
      type: Date,
      default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
}
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
