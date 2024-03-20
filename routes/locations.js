const express = require('express');
const Location = require('../models/location');

const router = express.Router();

// GET all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single location
router.get('/:id', getLocation, (req, res) => {
    res.json(res.location);
});

// CREATE a new location
router.post('/', async (req, res) => {
    const location = new Location({
        areaName: req.body.areaName,
        locationName: req.body.locationName
    });

    try {
        const newLocation = await location.save();
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a location
router.patch('/:id', getLocation, async (req, res) => {
    if (req.body.areaName != null) {
        res.location.areaName = req.body.areaName;
    }
    if (req.body.locationName != null) {
        res.location.locationName = req.body.locationName;
    }

    try {
        const updatedLocation = await res.location.save();
        res.json(updatedLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a location
router.delete('/:id', getLocation, async (req, res) => {
    try {
        await res.location.remove();
        res.json({ message: 'Location deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getLocation(req, res, next) {
    try {
        const location = await Location.findById(req.params.id);
        if (location == null) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.location = location;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;