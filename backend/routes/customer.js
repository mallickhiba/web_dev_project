const bcrypt = require("bcrypt");
const User = require('../models/User'); 
const Services = require("../models/Services");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const customerMiddleware = require('../middlewares/customerMiddleware');


router.use(customerMiddleware);

router.get("/getfavs", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "MY_SECRET");
        const customerId = decodedToken.email;
        console.log("fetching favourities for user with email: ", customerId);
        // Find the customer in the database and populate the favorites with service details
        const customer = await User.findOne({ email: customerId }).populate('favourites');

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        // Return the customer's favorites
        res.json({ favorites: customer.favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/addtofavs", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "MY_SECRET");
        const customeremail = decodedToken.email;
        console.log(decodedToken);
        console.log("fetching favourities for user with email: ", customeremail);
        console.log(req.body);
        //const sid  = req.body.sid; // Assuming the serviceId is provided in the request body
        const sid = req.body.sid;

        console.log("Adding service with ID", sid, "to favorites for user with email:", customeremail);

        // Find the customer in the database
        const customer = await User.findOne({ email: customeremail });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

    
        if (customer.favourites.includes(sid)) {
            return res.status(400).json({ message: "Service already in favorites" });
        }

        // Add the service to favorites
        customer.favourites.push(sid);

        // Save the updated customer object
        await customer.save();

        res.status(200).json({ message: "Service added to favorites successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




module.exports = router;