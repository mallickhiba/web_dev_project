const express = require('express');
const router = express.Router();
const Task = require("../models/Bookings");

// GET all tasks
router.get('/', async (req, res) => {
  try {
    console.log("getting all the tasks")
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// GET a specific task by ID
router.get('/:id', async (req, res) => {
  try {
    console.log("getting all the tasks w id " + req.params.id)
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.use((req, res, next) => {
  if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
  else next()
})


// POST a new task
router.post('/create', async (req, res) => {
  try {
    console.log("creating new task")
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json({ msg: "Task created", task: savedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// PUT/UPDATE an existing task
router.put('/update/:id', async (req, res) => {
  try {
    console.log("editing task with id "+ req.params.id)
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json({ msg: "Task updated", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// DELETE a task
router.delete('/delete/:id', async (req, res) => {
  try {
    console.log("deleting task w id" + req.params.id)
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }
    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router