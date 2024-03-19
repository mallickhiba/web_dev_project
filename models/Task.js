const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
