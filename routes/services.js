const Service = require("../models/Services");
var express = require("express");
const mongoose = require("mongoose");
const authenticate = require('../middlewares/authenticate.js');
const adminMiddleware = require('../middlewares/adminMiddleware');
const customerMiddleware = require('../middlewares/customerMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');
const Service = require('../models/Service'); // Add the missing import statement for the Service model
var router = express.Router();


//*************************FOLLOWING APIS CAN BE ACCESSED WITHOUT LOGIN********************************************
// Get all services -- TESTED
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

// View Available Services by Type. This is for finding sevices by type (includes pagination) --- TESTED
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
      
    const pagination = {
      offset: startIndex,
      records_per_page: limit,
      total_records: totalServices,
      total_pages: Math.ceil(totalServices / limit),
      current_page: +page
    };

    if (endIndex < totalServices) {
      pagination.next_page = +page + 1;
    }

      res.json({ pagination, services });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal server error" });
  }
});

// not tested 
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


// Get Service details by Service Name -- Tested
router.post('/getbyservicename', async (req, res) => {
  try {
    const { serviceName } = req.body;
    console.log("Searching for service with name:", serviceName);

    if (!serviceName) {
      return res.status(400).json({ msg: "Service name is required in the request body" });
    }
      //Checks for case-sensitive and extra white spaces
    const regexPattern = serviceName.replace(/\s+/g, '\\s+');
    const regex = new RegExp(regexPattern, 'i');

    // Populate service with packages and vendor name
    const services = await Service.find({ service_name: regex })
      .populate({
        path: 'vendor_id',
        select: 'firstName lastName -_id'
      });

    if (services.length === 0) {
      console.log("No services found with the provided service name:", serviceName);
      return res.json({ msg: "No services found with the provided service name" });
    }
    console.log("Services found:", services);
    res.json({ msg: "Services found", data: services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


// Get Service with vendor details using service ID. -- Tested 
router.post("/getbyservicewithvendor", async (req, res) => {
  try {
    console.log("Request received to get service with vendor details.");
    const { id } = req.body;
    console.log("Service ID:", id);
    
    const service = await Service.findById(id).populate({
      path: "vendor_id",
      select: "firstName lastName email phone -_id"
    });
    
    if (!service) {
      console.log("Service not found.");
      return res.json({ msg: "Service not found" });
    }

    console.log("Service found:", service);
    res.json({ msg: "Service found", data: service });
  } catch (error) {
    console.error("Error fetching service with vendor details:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


//Package APIs

// GET all packages of a service -- TESTED
router.get('/:serviceId/packages', async (req, res) => {
  try {
    console.log("Finding service to get packages for")
    const service = await Service.findById(req.params.serviceId).select('packages.package_id packages.name packages.price packages.description');;
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


// GET a specific package by package ID -- NOT WORKING 
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

// DELETE a specific package by package ID --NOT TESTED
router.delete('/:serviceId/packages/:packageId', async (req, res) => {
  try {
    console.log("Finding service to delete package from");
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }
    const packageId = parseInt(req.params.packageId); // Convert packageId to an integer
    const packageIndex = service.packages.findIndex(pkg => pkg.package_id === packageId);
    if (packageIndex === -1) {
      return res.status(404).json({ msg: "Package not found" });
    }
    service.packages.splice(packageIndex, 1);
    await service.save();
    console.log("Package deleted");
    res.json({ msg: "Package deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});









// Get reviews for a specific service ***NOT TESTED
router.get('/service/:id/reviews', async (req, res) => {
  try {
    const serviceId = req.params.id;
    const reviews = await Review.find({ service: serviceId }).populate('user', 'firstName lastName');
    res.json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

//******FOLLOWING APIS CAN ONLY BE ACCESED WITH LOGGED IN ADMIN AND VENDOR USERS */
router.use(authenticate);

// middleware to ensure only admin can create/edit/delete services. 
//Middleware should ensure admin can perform CRUD operations on all services and vendor can only do so on services with his vendorID
// To delete/edit/add a package, vendor/admin can edit the service and perform operaions. 
router.use(adminMiddleware);
router.use(vendorMiddleware);

//Add a new service. -- TESTED
router.post("/create", async (req, res) => {
  try {
    let vendorId;
    // Check if the user is admin then extract vendor id from body
    if (req.user.role == "admin") {
      vendorId = req.body.vendor_id;
    } else if (req.user.role === "vendor") {
      // If user is vendor then extract the vendor ID from their account
      vendorId = req.user.id; 
    } else {
      return res.status(403).json({ msg: "Unauthorized access" }); // Return 403 Forbidden for other roles
    }
    console.log("Vendor ID:", vendorId);

    const serviceData = { ...req.body, vendor_id: vendorId };
    await Service.create(serviceData);
    console.log("Service data:", serviceData);
    res.json({ msg: "Service added" });
  } catch (error) {
    console.error(error);
    console.error("Error adding service:", error); // Log the error
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Edit service details including add/edit package as well. -- TESTED BUT NOT WORKING FOR ADDING/EDITING PACKAGE
router.put("/:id", async (req, res) => {
  try {
    console.log("Updating service details...");

    const service = await Service.findById(req.params.id);
    if (!service) {
      console.log("Service not found.");
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the user is a vendor
    if (req.user && req.user.role === "vendor") {
      const vendorId = req.user.userId;
      // Check if the vendor ID matches the vendor ID associated with the service
      if (vendorId.toString() !== service.vendor_id.toString()) {
        console.log("Unauthorized access.");
        return res.status(403).json({ msg: "You are not authorized to edit this service" });
      }
    }

    // Update service fields based on request body
    service.service_name = req.body.service_name || service.service_name;
    service.service_type = req.body.service_type || service.service_type;
    service.cancellation_policy = req.body.cancellation_policy || service.cancellation_policy;
    service.staff = req.body.staff || service.staff;
    service.description = req.body.description || service.description;
    service.start_price = req.body.start_price || service.start_price;

    console.log("Service updated:", service);

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

    console.log("Service saved:", service);

    res.json({ msg: "Service updated", data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Delete any service. -- TESTED
router.post("/deleteby", async (req, res) => {
  try {
    const service = await Service.findById(req.body.id);
    if (!service) {
      console.log("Service not found.");
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the user is an admin or the vendor associated with the service
    if (req.user.role === "admin" || (req.user.role === "vendor" && service.vendor_id.toString() === req.user.userId.toString())) {
      await Service.deleteOne({ _id: req.body.id });
      console.log("Service deleted.");
      return res.json({ msg: "Service deleted" });
    } else {
      console.log("Unauthorized access.");
      return res.status(403).json({ msg: "Not authorized to delete this service" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;