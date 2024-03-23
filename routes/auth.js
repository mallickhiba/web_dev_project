const bcrypt = require("bcrypt");
const Users = require("../models/User");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const transporter = require('../emailService.js'); 
const crypto = require('crypto');


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

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token.split(" ")[1], "MY_SECRET");
    const { email, role } = user;
    const profile = await Users.findOne({ email }).select("-password -_id");
    if (role === "admin" || role === "vendor") {
      profile.favourites = undefined;
    }
    if (role === "admin" || role === "customer") {
      profile.approved = undefined;
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/updateprofile", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token.split(" ")[1], "MY_SECRET");
    const userId = decodedToken.id;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phoneNumber = req.body.phoneNumber;

    await user.save(); // Save the changes to the user object
    return res.json({ msg: "PROFILE UPDATED" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.post("/changepassword", async (req, res) => {
  try {
    const { token, password, newPassword, confirmPassword } = req.body;
    const decodedToken = jwt.verify(token, "MY_SECRET");
    const { email } = decodedToken;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ msg: "USER NOT FOUND" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    user.password = hashedPassword;
    await user.save();
    return res.json({ msg: "PASSWORD CHANGED SUCCESSFULLY" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

router.post("/forgotpassword", async (req, res) => {
const { email } = req.body;

    // Generate unique token
    const token = generateToken();

    // Send email with reset link
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Your OTP to reset your password is: ${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            return res.send('Email sent');
        }
    });
});

/** 
// Endpoint to reset password
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  // Validate token (check if it's valid and not expired)
  // Update user's password in the database

  // Example response
  return res.send('Password reset successful');
});*/

//not checked yet
/** 
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
}); */


router.post("/resetpassword", async (req, res) => {
  try {
      const { email, token, newPassword } = req.body;

      // Find the user by the email and reset token
      const user = await Users.findOne({ email, resetPasswordToken: token });

      // If user not found or token is expired, return error
      if (!user || user.resetPasswordExpires < Date.now()) {
          return res.status(400).json({ error: "Invalid or expired token" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and clear reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save the user object
      await user.save();

      // Return success message
      return res.json({ msg: "Password reset successful" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
  }
});


module.exports = router;
