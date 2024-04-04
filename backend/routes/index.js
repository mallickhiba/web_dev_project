const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

const authenticate = require('../middlewares/authenticate.js');

console.log("in index router file");

const authRouter = require("./auth");
const serviceRouter = require("./services");

const bookingRouter = require("./bookings");
const reviewRouter = require("./reviews");
const adminRouter = require("./admin");
const customerRouter = require("./customer");

router.use("/auth", authRouter);
router.use("/services", serviceRouter);

//put this middleware after logging in to apply it to neeche wali routes
router.use(authenticate);

//add role specific middleware

router.use("/admin", adminRouter);
router.use("/bookings", bookingRouter);
router.use("/customer", customerRouter);
router.use("/reviews", reviewRouter);

module.exports = router;