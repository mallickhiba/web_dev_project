const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const vendorMiddleware = require('../middlewares/vendorMiddleware');


// Get all details of a specific vendor
router.get("/vendors/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req; // Assuming user information is available in the request object
        // Check if the user is an admin
        if (user.isAdmin) {
            const vendor = await Users.findById(id);
            res.json(vendor);
        } else {
            // Check if the user is the vendor they want to see
            if (user.id === id) {
                const vendor = await Users.findById(id);
                res.json(vendor);
            } else {
                res.status(403).json({ error: "Access Denied" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

router.use(vendorMiddleware)

// Get all services of a specific vendor
router.get("/vendors/:id/services", async (req, res) => {
    try {
        const { id } = req.params;
        const services = await Service.find({ vendor_id: id });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}); // they can just click on a service to view its packages (general API)
