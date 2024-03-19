const Users = require("../models/User");
const Project = require("../models/Project");
var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("getting all the projects");
    const proj = await Project.find();
    res.json({ proj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// getting by pid in URL
router.get("/:id", async (req, res) => {
  try {
    console.log("getting project with pid " + req.params.id);
    const proj = await Project.findOne({ pid: req.params.id });
    if (!proj) {
      return res.status(404).json({ msg: "project not found" });
    }
    res.json({ msg: "PROJECT FOUND", data: proj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//getting by pid with user from body
router.post("/getbypidwithuser", async (req, res) => {
  try {
    const proj = await Project.findOne({ pid: req.body.pid }).populate(
      "user",
      "-password"
    );
    if (!proj) return res.json({ msg: "proj NOT FOUND" });
    res.json({ msg: "proj FOUND", data: proj });
  } catch (error) {
    console.error(error);
  }
});

/****ADDING MIDDLEWARE FOR ROLE-BASED APIS****/

router.use((req, res, next) => {
  //res.send(req.user.email + " IS AN ADMIN? " + req.user.admin)
  if (!req.user.admin) return res.json({ msg: "NOT ADMIN" });
  else next();
});

router.post("/create", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.json({ msg: "USER NOT FOUND" });

    if (!req.body.pid || !req.body.name) {
      return res.status(400).json({ msg: "pid and name are required" });
    }

    const existingProject = await Project.findOne({ pid: req.body.pid });
    if (existingProject) {
      return res
        .status(409)
        .json({ msg: "Project with the same pid already exists" });
    }

    await Project.create({ ...req.body, user: user._id });
    res.json({ msg: "proj ADDED by user: " + user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//updating via URL
router.put("/:id", async (req, res) => {
  try {
    const proj = await Project.findOne({ pid: req.params.id });
    if (!proj) {
      return res.status(404).json({ msg: "Project not found" });
    }
    proj.name = req.body.name || proj.name;
    proj.description = req.body.description || proj.description;
    proj.updatedAt = Date.now();
    await proj.save();
    res.json({ msg: "Project updated", data: proj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//deleting via body
router.post("/deleteby", async (req, res) => {
  try {
    const proj = await Project.findOne({ pid: req.body.pid });
    if (!proj) return res.json({ msg: "proj NOT FOUND" });
    await Project.deleteOne({ p: req.body.p });
    res.json({ msg: "proj DELETED" });
  } catch (error) {
    console.error(error);
  }
});


module.exports = router;
