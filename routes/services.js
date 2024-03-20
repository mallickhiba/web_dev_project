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


// View Available Services by Type. This is for finding sevices by type (includes pagination) --- not tested yet
router.get('/:serviceType', async (req, res) => {
  const { serviceType } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {

    if (!['decor', 'venue', 'catering', 'photography'].includes(serviceType)) {
          return res.status(400).json({ msg: "Invalid service type" });
      }

      // Query services by service type with pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const totalServices = await Service.countDocuments({ service_type: serviceType });
      const services = await Service.find({ service_type: serviceType }).limit(limit).skip(startIndex);

      // Pagination result
      const pagination = {};
      if (endIndex < totalServices) {
          pagination.next = {
              page: +page + 1,
              limit: +limit
          };
      }
      if (startIndex > 0) {
          pagination.prev = {
              page: +page - 1,
              limit: +limit
          };
      }

      res.json({ services, pagination });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    console.log("getting service with id " + req.params.id);
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    res.json({ msg: "SERVICE FOUND", data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


// Get Service details by Service Name 
router.post('/getbyservicename', async (req, res) => {
  try {
      const { serviceName } = req.body;

      if (!serviceName) {
          return res.status(400).json({ msg: "Service name is required in the request body" });
      }
      // Populate service with packages and vendor name
      const services = await Service.find({ service_name: serviceName })
      .populate({
          path: 'packages',
          select: 'name price description'
      })
      .populate({
          path: 'vendor_id',
          select: 'firstName lastName -_id'
      });
      if (services.length === 0) {
          return res.json({ msg: "No services found with the provided service name" });
      }
      res.json({ msg: "Services found", data: services });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});


router.post("/getbyservicewithvendor", async (req, res) => {
  try {
    const service = await Service.findById(req.body.service_id).populate(
      "vendor_id",
      "-password"
    );
    if (!service) return res.json({ msg: "Service not found" });
    res.json({ msg: "Service found", data: service });
  } catch (error) {
    console.error(error);
  }
});


//Package APIs

// GET all packages of a service
router.get('/:serviceId/packages', async (req, res) => {
  try {
    console.log("Finding service to get packages for")
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    console.log("getting all packages for your required service")
    res.json({ packages: service.packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


// GET a specific package by package ID
router.get('/:serviceId/packages/:packageId', async (req, res) => {
  try {
    console.log("Finding service to get packages for")
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    const packageId = parseInt(req.params.packageId); // Convert packageId to an integer
    const package = service.packages.find(pkg => pkg.package_id === packageId);
    if (!package) {
      return res.status(404).json({ msg: "Package not found" });
    }
    console.log("getting your required package")
    res.json({ package });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// middleware to ensure only admin can create/edit/delete services. 
//Middleware should ensure admin can perform CUD operations on all services and vendor can only do so on services with his vendorID
// To delete/edit/add a package, vendor/admin can edit the service and perform operaions. 

router.use((req, res, next) => {
  if (!req.user.admin && !req.user.vendor) {
    return res.json({ msg: "NOT AUTHORIZED" });
  }
  next();
});



//Add a new service.
router.post("/create", async (req, res) => {
  try {
    let vendorId;
    // Check if the user is admin then extract vendor id from body
    if (req.user.role === 'admin') {
        vendorId = req.body.vendor_id;
    } else {
        // If user is vendor then extract the vendor ID from their account
        vendorId = req.user.vendor_id; 
    }
    const serviceData = { ...req.body, vendor_id: vendorId };
    await Service.create(serviceData);
    res.json({ msg: "Service added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


// Edit service details including add/edit package as well. 
router.put("/:id", async (req, res) => {
try {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ msg: "Service not found" });
  }

  let vendorId;
  if (req.user.role === 'admin') {
      // If the user is an admin, extract the vendor ID from the request body
      vendorId = req.body.vendor_id;
  } else {
      // If the user is vendor, extract the vendor ID from their account
      vendorId = req.user.vendor_id; 
  }
  // Check if the vendor ID matches the vendor ID associated with the service
  if (vendorId.toString() !== service.vendor_id.toString()) {
      return res.status(403).json({ msg: "You are not authorized to edit this service" });
  }

  // Update service fields based on request body
  service.service_name = req.body.service_name || service.service_name;
  service.service_type = req.body.service_type || service.service_type;
  service.cancellation_policy = req.body.cancellation_policy || service.cancellation_policy;
  service.staff = req.body.staff || service.staff;
  service.description = req.body.description || service.description;
  service.start_price = req.body.start_price || service.start_price;

  if (req.body.packages) {
    for (const pkg of req.body.packages) {
      // Check if the package already exists
      const existingPackageIndex = service.packages.findIndex(existingPkg => existingPkg.package_id === pkg.package_id);
      if (existingPackageIndex !== -1) {
        // If the package exists, update its details
        service.packages[existingPackageIndex].name = pkg.name || service.packages[existingPackageIndex].name;
        service.packages[existingPackageIndex].price = pkg.price || service.packages[existingPackageIndex].price;
        service.packages[existingPackageIndex].description = pkg.description || service.packages[existingPackageIndex].description;
      } else {
        // If the package doesn't exist, add it to the service's packages array
        service.packages.push(pkg);
      }
    }
  }
  await service.save();

  res.json({ msg: "Service updated", data: service });
}
catch (error) {
  console.error(error);
  res.status(500).json({ msg: "Internal server error" });
}
});

// Delete any service. 
router.post("/deleteby", async (req, res) => {
  try {
    const service = await Service.findById(req.body.id);
    if (!service) return res.json({ msg: "Service not found" });

    if (req.user.admin) {
      // Admin can delete any service
      await Service.deleteOne({ _id: req.body.id });
      return res.json({ msg: "Service deleted by admin" });
    }
    if (req.user.vendor) {
      // Vendor can only delete a service they are associated with
      if (service.vendor_id.toString() !== req.user.vendor.toString()) {
        return res.json({ msg: "Not authorized to delete this service" });
      }
      await Service.deleteOne({ _id: req.body.id });
      return res.json({ msg: "Service deleted by vendor" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});



module.exports = router;
