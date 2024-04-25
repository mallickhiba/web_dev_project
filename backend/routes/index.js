const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

const authenticate = require('../middlewares/authenticate.js');
/*
const adminMiddleware = require('../middlewares/adminMiddleware');
const customerMiddleware = require('../middlewares/customerMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');*/

const authRouter = require("./auth");
const bookingRouter = require("./bookings");
const locationRouter = require("./locations");
const reviewRouter = require("./reviews")
const serviceRouter = require("./services")
const adminRouter = require("./admin")
const customerRouter = require("./customer");

router.use("/auth", authRouter);
router.use("/services", serviceRouter);


//put this middleware after logging in to apply it to neeche wali routes
router.use(authenticate);

/*router.use(adminMiddleware);
router.use(customerMiddleware);
router.use(vendorMiddleware);*/


router.use("/admin", adminRouter);
router.use("/bookings", bookingRouter);
router.use("/locations", locationRouter);
router.use("/reviews", reviewRouter);
router.use('/customer', customerRouter);


module.exports = router;