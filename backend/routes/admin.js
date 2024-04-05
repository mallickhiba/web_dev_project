const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(adminMiddleware)

// Get all users - TESTED
router.get("/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Get all customers
router.get("/customers", async (req, res) => {
  try {
    const users = await Users.find({ role: "customer" });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Get all vendors
router.get("/vendors", async (req, res) => {
  try {
    const users = await Users.find({ role: "vendor" });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Get all vendors pending approval
router.get("/vendors/pending", async (req, res) => {
  try {
    const vendors = await Users.find({ role: "vendor", approved: false });
    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Approve vendor
router.post("/vendors/approve", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    console.log("attempting to approve vendor with email and role: ", user.email, user.role)
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.role !== "vendor") {
      return res.status(400).json({ error: "User is not a vendor." });
    }
    user.approved = true;
    await user.save();
    res.json({ message: "User is a vendor and approved." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Deactivate vendor
router.post("/vendors/deactivate", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.role !== "vendor") {
      return res.status(400).json({ error: "User is not a vendor." });
    }
    user.approved = false;
    await user.save();
    res.json({ message: "User is a vendor and NOT APPROVED." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//Get user by email - TESTED
router.post("/users/searchbyemail", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({msg: "USER FOUND", data: user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});

//Update user by ID -- TESTED but had to remove check on name length
router.put("/users/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email format.");
    }
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true }
    );
    updatedUser.save();
    console.log("USER UPDATED")
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

//Delete user by ID -- TESTED
router.delete("/users/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;