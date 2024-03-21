const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName , role} = req.body;
    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      throw new Error(
        "Password must be at least 8 characters long and include both numbers and alphabets."
      );
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Invalid email format.");
    }
    if (firstName.length < 3) {
      throw new Error("First name must be at least 3 characters long.");
    }
    if (lastName.length < 3) {
      throw new Error("Last name must be at least 3 characters long.");
    }
    let user = await Users.findOne({ email });
    if (user) return res.json({ msg: "USER EXISTS" });
    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    return res.json({ msg: "CREATED" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;
      // Find user by email
      const user = await Users.findOne({ email });
      if (!user) return res.json({ msg: "USER NOT FOUND" });
      // Check password
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) return res.json({ msg: "WRONG PASSWORD" });
      const token = jwt.sign(
          {
              id: user._id,
              email,
              role: user.role // Include user's role in the token
          },
          "MY_SECRET",
          { expiresIn: "1d" }
      );
      res.json({
          msg: "LOGGED IN",
          token,
          user: {
              id: user._id,
              email: user.email,
              role: user.role
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ msg: "USER NOT FOUND" });
    }
    // Generate a password reset token
    const resetToken = jwt.sign({ email }, "MY_SECRET", { expiresIn: "1h" });
    // Send the reset token to the user's email
    // ... code to send email with reset token ...
    return res.json({ msg: "RESET TOKEN SENT" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

//not checked yet

router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword, pin } = req.body;
    const decodedToken = jwt.verify(resetToken, "MY_SECRET");
    const { email } = decodedToken;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ msg: "USER NOT FOUND" });
    }
    if (pin !== user.pin) {
      return res.json({ msg: "INVALID PIN" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashedPassword;
    await user.save();
    return res.json({ msg: "PASSWORD RESET SUCCESSFUL" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
