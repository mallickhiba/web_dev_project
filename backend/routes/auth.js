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
      throw new Error("Password must be at least 8 characters long and include both numbers and alphabets.");
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
    if (user) return res.status(400).json({ error: "USER EXISTS" });
    await Users.create({
      ...req.body,
      password: await bcrypt.hash(password, 5),
    });
    console.log("USER CREATED")
    return res.json({ msg: "CREATED" });
  
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message }); // Return validation error messages
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      throw new Error("USER NOT FOUND");
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      throw new Error("WRONG PASSWORD");
    }
    const token = jwt.sign(
      {
        id: user._id,
        email,
        role: user.role
      },
      "MY_SECRET",
      { expiresIn: "1d" }
    );
    console.log("LOGGED IN")
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
    res.status(500).json({ error: error.message }); 
}});


router.post("/logout", async (req, res) => {
  try {
    req.headers.authorization = null;
    return res.json({ msg: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
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

router.post("/updateaccount", async (req, res) => {
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

    await user.save()
    return res.json({ msg: "PROFILE UPDATED" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.post("/changepassword", async (req, res) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token.split(" ")[1], "MY_SECRET");
    const userId = decodedToken.id;

    const user = await Users.findById(userId);
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
console.log(req.body.email, "forgot password")
const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ msg: "No user registered with this email" });
    }

    // Generate unique token
    const token = generateToken();
    user.resetPasswordToken = token;
    console.log("user has resettoken: ", user.resetPasswordToken ) // just for checking


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
            return res.send('Email sent and users token is saved in db', user.resetPasswordToken);

        }
    });
});

router.post("/resetpassword", async (req, res) => {
  try {
      const { email, resetToken, newPassword } = req.body;

      const user = await Users.findOne({ email});
      if (!user || user.resetPasswordExpires < Date.now()) {
          return res.status(400).json({ error: "Invalid or expired token" });
      }
      if(user.resetPasswordToken == resetToken){
        console.log("CORRECT TOKEN");
        if (
          newPassword.length < 8 ||
          !/\d/.test(password) ||
          !/[a-zA-Z]/.test(password)
        ) {
          throw new Error("Password must be at least 8 characters long and include both numbers and alphabets.");
        }
      const hashedPassword = await bcrypt.hash(newPassword, 5);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.log("CORRECT TOKEN");

      return res.json({ msg: "Password reset successful" });}
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
