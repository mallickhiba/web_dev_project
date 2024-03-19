const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const authRouter = require("./auth");
const projectRouter = require("./project");
const taskRouter = require("./task");
const activityRouter = require("./activity");

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

router.use("/project", projectRouter);
router.use("/task", taskRouter);
router.use("/activity", activityRouter);

module.exports = router;