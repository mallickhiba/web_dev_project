const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

const authRouter = require("./auth");

const bookingRouter = require("./bookings");
const locationRouter = require("./locations");
//const packageRouter = require("./packages");
const reviewRouter = require("./reviews")
const serviceRouter = require("./services")


router.use("/auth", authRouter);

//put this middleware after logging in to apply it to neeche wali routes
router.use(async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const user = jwt.verify(token.split(" ")[1], "MY_SECRET")
        req.user = user;
        next()
    } catch (e) {
        return res.json({ msg: "TOKEN NOT FOUND / INVALID" })
    }
})

router.use("/bookings", bookingRouter);
router.use("/locations", locationRouter);
//router.use("/packages", packageRouter);
router.use("/reviews", reviewRouter);
router.use("/services", serviceRouter);

module.exports = router;