const express = require('express');
const router = express.Router();
const Activity = require("../models/Activity");

// GET all activities
router.get('/', async (req, res) => {
    try {
        console.log("getting all the activities")
        const activities = await Activity.find();
        res.json({ activities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// GET a specific activity by ID
router.get('/:id', async (req, res) => {
    try {
        console.log("getting activity with id " + req.params.id)
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ msg: "Activity not found" });
        }
        res.json({ activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
})

// POST a new activity
router.post('/create', async (req, res) => {
    try {
        console.log("creating new activity")
        const newActivity = new Activity(req.body);
        const savedActivity = await newActivity.save();
        res.status(201).json({ msg: "Activity created", activity: savedActivity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// PUT/UPDATE an existing activity
router.put('/update/:id', async (req, res) => {
    try {
        console.log("editing activity with id "+ req.params.id)
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!activity) {
            return res.status(404).json({ msg: "Activity not found" });
        }
        res.json({ msg: "Activity updated", activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// DELETE an activity
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log("deleting activity with id" + req.params.id)
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ msg: "Activity not found" });
        }
        res.json({ msg: "Activity deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router