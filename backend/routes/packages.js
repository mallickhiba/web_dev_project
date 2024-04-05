const express = require('express');
const Package = require("../models/Packages");

const router = express.Router();

// GET all packages
router.get('/', async (req, res) => {
    try {
        console.log("getting all the packages")
        const packages = await Package.find();
        res.json({ packages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// GET a specific package by ID
router.get('/:id', async (req, res) => {
    try {
        console.log("getting package with id " + req.params.id)
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.json({ package });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.use((req, res, next) => {
    if (req.user.role !== "admin") return res.json({ msg: "NOT ADMIN" });
   else next();
  });

// POST a new package
router.post('/create', async (req, res) => {
    try {
        console.log("creating new package")
        const newPackage = new Package(req.body);
        const savedPackage = await newPackage.save();
        res.status(201).json({ msg: "Package created", package: savedPackage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// PUT/UPDATE an existing package
router.put('/update/:id', async (req, res) => {
    try {
        console.log("editing package with id "+ req.params.id)
        const package = await Package.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!package) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.json({ msg: "Package updated", package });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// DELETE a package
router.delete('/delete/:id', async (req, res) => {
    try {
        console.log("deleting package with id" + req.params.id)
        const package = await Package.findByIdAndDelete(req.params.id);
        if (!package) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.json({ msg: "Package deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;
