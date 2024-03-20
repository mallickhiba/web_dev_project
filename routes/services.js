const Service = require("../models/Services");
var express = require("express");
const mongoose = require("mongoose");

var router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("getting all the services");
    const services = await Service.find();
    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    console.log("getting service with id " + req.params.id);
    const service = await Service.findOne({ service_id: req.params.id });
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    res.json({ msg: "SERVICE FOUND", data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/getbyservicewithvendor", async (req, res) => {
  try {
    const service = await Service.findOne({ service_id: req.body.service_id }).populate(
      "vendor_id",
      "-password"
    );
    if (!service) return res.json({ msg: "Service not found" });
    res.json({ msg: "Service found", data: service });
  } catch (error) {
    console.error(error);
  }
});

router.use((req, res, next) => {
  if (!req.user.admin) return res.json({ msg: "NOT ADMIN" });
  else next();
});

router.post("/create", async (req, res) => {
  try {
    const existingService = await Service.findOne({ service_id: req.body.service_id });
    if (existingService) {
      return res
        .status(409)
        .json({ msg: "Service with the same id already exists" });
    }

    await Service.create(req.body);
    res.json({ msg: "Service added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const service = await Service.findOne({ service_id: req.params.id });
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    service.service_name = req.body.service_name || service.service_name;
    service.cancellation_policy = req.body.cancellation_policy || service.cancellation_policy;
    service.staff = req.body.staff || service.staff;
    service.description = req.body.description || service.description;
    service.updatedAt = Date.now();
    await service.save();
    res.json({ msg: "Service updated", data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/deleteby", async (req, res) => {
  try {
    const service = await Service.findOne({ service_id: req.body.service_id });
    if (!service) return res.json({ msg: "Service not found" });
    await Service.deleteOne({ service_id: req.body.service_id });
    res.json({ msg: "Service deleted" });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
