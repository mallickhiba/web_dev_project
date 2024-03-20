const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");


router.post("/getbyemail", async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: "User not found." });
        res.json({msg: "USER FOUND", data: user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});


router.use((req, res, next) => {
  if (req.user.role !== "admin") return res.json({ msg: "NOT ADMIN" });
 else next();
});

router.get("/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.put("/users/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    if (firstName.length < 3) {
      throw new Error("First name must be at least 3 characters long.");
    }
    if (lastName.length < 3) {
      throw new Error("Last name must be at least 3 characters long.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email format.");
    }
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { firstName, lastName, email },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
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
