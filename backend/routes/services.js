var express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');
const authenticate = require('../middlewares/authenticate.js');
const authorization = require('../middlewares/authorization.js');
const adminMiddleware = require('../middlewares/adminMiddleware');
const customerMiddleware = require('../middlewares/customerMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');
const Service = require('../models/Services'); // Add the missing import statement for the Service model
const VenueService = require('../models/Services').model('VenueService');
const PhotographyService = require('../models/Services').model('PhotographyService');
const CateringService = require('../models/Services').model('CateringService');
const DecorService = require('../models/Services').model('DecorService');
const BaseService = require('../models/Services'); // Adjust the path as per your project structure
const Users = require('../models/User');
const vendorApprovalMiddleware = require("../middlewares/vendorApproval.js");
var router = express.Router();


//*************************FOLLOWING APIS CAN BE ACCESSED WITHOUT LOGIN********************************************
// Getting Service based on ID-TESTED
// Define the GET route to fetch a service by ID
router.get('/byid/:id', async (req, res) => {
  try {
    console.log("Getting service with id " + req.params.id);
    const service = await Service.findById(req.params.id);
    console.log("searching")
    if (!service) {
      console.log("fjfioej")
     return res.status(404).json({ msg: "Service not found" });
    }
    res.json({ msg: "SERVICE FOUND", data: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


router.get('/venues1', async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'average_rating';
    const {
      start_price,
      average_rating,
      capacity,
      cancellation_policy, // Accept comma-separated list of cancellation policies
      city, // Accept comma-separated list of cities
      area, // Accept comma-separated list of areas
      staff,
      outdoor // Accept comma-separated list of outdoor options
    } = req.query;

     // Handle sorting
    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc'
    }


    // Build filter criteria
    let filter = {};
    if (cancellation_policy) {
      const policies = cancellation_policy.split(',');
      filter.cancellation_policy = { $in: policies };
    }
    if (average_rating) filter.average_rating = { $gte: parseFloat(average_rating) };
    if (city) {
      const cities = city.split(',');
      filter.city = { $in: cities };
    }
    if (area) {
      const areas = area.split(',');
      filter.area = { $in: areas };
    }
    if (outdoor) {
      const outdoors = outdoor.split(',');
      filter.outdoor = { $in: outdoors };
    }
    if (staff) {
      const staffOptions = staff.split(',');
      filter.staff = { $in: staffOptions };
    }
    if (start_price) {
      const [minPrice, maxPrice] = start_price.split('-').map(Number);
      filter.start_price = { $gte: minPrice, $lte: maxPrice };
    }
    if (capacity) {
      const [minCapacity, maxCapacity] = capacity.split('-').map(Number);
      filter.capacity = { $gte: minCapacity, $lte: maxCapacity };
    }
    // Apply search filter
    filter.service_name = { $regex: search, $options: 'i' };

    // Fetch venues
    const venues = await VenueService.find(filter)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    // Total count
    const total = await VenueService.countDocuments(filter);

    // Response
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      venues
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});


router.get('/catering1', async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'average_rating';
    const {
      start_price,
      average_rating,
      city,
      area, // Accept comma-separated list of areas
      cancellation_policy, // Accept comma-separated list of cancellation policies
      staff, // Accept comma-separated list of staff options
      cuisine // Accept comma-separated list of cuisines
    } = req.query;

    // Handle sorting
    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc';
    }

    // Build filter criteria
    let filter = {};
    if (cancellation_policy) {
      const policies = cancellation_policy.split(',');
      filter.cancellation_policy = { $in: policies };
    }
    if (average_rating) filter.average_rating = { $gte: parseFloat(average_rating) };
    if (city) {
      const cities = city.split(',');
      filter.city = { $in: cities };
    }
    if (area) {
      const areas = area.split(',');
      filter.area = { $in: areas };
    }
    if (staff) {
      const staffOptions = staff.split(',');
      filter.staff = { $in: staffOptions };
    }
    if (cuisine) {
      const cuisines = cuisine.split(',');
      filter.cuisine = { $in: cuisines };
    }
    if (start_price) {
      const [minPrice, maxPrice] = start_price.split('-').map(Number);
      filter.start_price = { $gte: minPrice, $lte: maxPrice };
    }

    // Apply search filter
    filter.service_name = { $regex: search, $options: 'i' };

    // Fetch catering services
    const caterings = await CateringService.find(filter)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    // Total count
    const total = await CateringService.countDocuments(filter);

    // Response
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      caterings
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

 // Adjust the path to your model
router.get('/photography1', async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'average_rating';
    const {
      city,
      area, // Accept comma-separated list of areas
      cancellation_policy, // Accept comma-separated list of cancellation policies
      staff, // Accept comma-separated list of staff options
      start_price,
      average_rating,
      drone // New field specific to photography services
    } = req.query;

    // Handle sorting
    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc';
    }

    // Build filter criteria
    let filter = {};
    if (city) filter.city = city;
    if (area) {
      const areas = area.split(','); // Split comma-separated areas into an array
      filter.area = { $in: areas }; // Use $in operator to match any of the provided areas
    }
    if (cancellation_policy) {
      const policies = cancellation_policy.split(',');
      filter.cancellation_policy = { $in: policies };
    }
    if (staff) {
      const staffOptions = staff.split(',');
      filter.staff = { $in: staffOptions };
    }
    if (average_rating) filter.average_rating = { $gte: parseFloat(average_rating) };
    if (start_price) {
      const [minPrice, maxPrice] = start_price.split('-').map(Number);
      filter.start_price = { $gte: minPrice, $lte: maxPrice };
    }
    if (drone !== undefined) filter.drone = drone; // New field specific to photography services

    // Apply search filter
    filter.service_name = { $regex: search, $options: 'i' };

    // Fetch photography services
    const photographies = await PhotographyService.find(filter)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    // Total count
    const total = await PhotographyService.countDocuments(filter);

    // Response
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      photographies
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

router.get('/decor1', async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'average_rating';
    const {
      start_price,
      average_rating,
      city,
      area,
      cancellation_policy,
      staff,
      decortype // New field specific to decor services
    } = req.query;

    // Handle sorting
    req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc';
    }

    // Build filter criteria
    let filter = {};
    if (cancellation_policy) {
      const policies = cancellation_policy.split(',');
      filter.cancellation_policy = { $in: policies };
    }
    if (average_rating) filter.average_rating = { $gte: parseFloat(average_rating) };
    if (city) {
      const cities = city.split(',');
      filter.city = { $in: cities };
    }
    if (area) {
      const areas = area.split(',');
      filter.area = { $in: areas };
    }
    if (staff) {
      const staffOptions = staff.split(',');
      filter.staff = { $in: staffOptions };
    }
    if (decortype) {
      const decorTypes = decortype.split(',');
      filter.decortype = { $in: decorTypes };
    }
    if (start_price) {
      const [minPrice, maxPrice] = start_price.split('-').map(Number);
      filter.start_price = { $gte: minPrice, $lte: maxPrice };
    }

    // Apply search filter
    filter.service_name = { $regex: search, $options: 'i' };

    // Fetch decor services
    const decors = await DecorService.find(filter)
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    // Total count
    const total = await DecorService.countDocuments(filter);

    // Response
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      decors
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});


// API to get all services for a specific vendor with pagination, filtering, and sorting -- TESTED
router.get('/servicesbyVendor', authenticate, vendorMiddleware,vendorApprovalMiddleware, async (req, res) => {
  try {
      const vendorId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const serviceType = req.query.serviceType || '';
      const sortBy = req.query.sortBy || 'createdAt';
      const sortOrder = req.query.sortOrder || 'desc';
      
      let queryCriteria = { vendor_id: vendorId };

      // Add service category filter if provided
      if (serviceType) {
          queryCriteria.service_category = serviceType;
      }

      const skip = (page - 1) * limit;
      let services;
      let totalServices;

      // Use discriminators or BaseService based on service type
      switch (serviceType) {
          case 'catering':
              services = await CateringService.find(queryCriteria)
                  .limit(limit)
                  .skip(skip)
                  .sort({ [sortBy]: sortOrder });
              totalServices = await CateringService.countDocuments(queryCriteria);
              break;
          case 'decor':
              services = await DecorService.find(queryCriteria)
                  .limit(limit)
                  .skip(skip)
                  .sort({ [sortBy]: sortOrder });
              totalServices = await DecorService.countDocuments(queryCriteria);
              break;
          case 'photography':
              services = await PhotographyService.find(queryCriteria)
                  .limit(limit)
                  .skip(skip)
                  .sort({ [sortBy]: sortOrder });
              totalServices = await PhotographyService.countDocuments(queryCriteria);
              break;
          case 'venue':
              services = await VenueService.find(queryCriteria)
                  .limit(limit)
                  .skip(skip)
                  .sort({ [sortBy]: sortOrder });
              totalServices = await VenueService.countDocuments(queryCriteria);
              break;
          default:
              // If no service type specified, retrieve all services
              services = await BaseService.find(queryCriteria)
                  .limit(limit)
                  .skip(skip)
                  .sort({ [sortBy]: sortOrder });
              totalServices = await BaseService.countDocuments(queryCriteria);
              break;
      }

      const pagination = {
          offset: skip,
          records_per_page: limit,
          total_records: totalServices,
          total_pages: Math.ceil(totalServices / limit),
          current_page: page
      };

      if (skip + limit < totalServices) {
          pagination.next_page = page + 1;
      }

      res.json({ pagination, services });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Internal Server Error" });
  }
});


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

      const totalServices = await Service.countDocuments({ service_category: serviceType });
      const services = await Service.find({ service_category: serviceType }).limit(limit).skip(startIndex);

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






//TESTED
router.post('/getbyservicename', async (req, res) => {
  try {
    const { serviceName } = req.body;
    console.log("Searching for service with name:", serviceName);

    if (!serviceName) {
      return res.status(400).json({ msg: "Service name is required in the request body" });
    }

    // Create a regex pattern for case-insensitive and extra white spaces in the service name
    const regexPattern = serviceName.replace(/\s+/g, '\\s+');
    const regex = new RegExp(regexPattern, 'i');

    // Populate service with packages and vendor name
    const services = await Service.find({ service_name: regex })
      .populate({
        path: 'vendor_id',
        model: 'User', // Use the correct collection name here
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


// Get Service with vendor details using service ID. -- Tested GIVES VENDOR ID NULL 
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

//API TO FIND ORDEREED LIST OF SERVICES BY SERVICE TYPE - WORKING!!
router.post("/findclosest", async (req, res) => {
  try {
    const { serviceType, latitude, longitude } = req.body;
    console.log("Finding services of type", serviceType, "sorted by closest latitude and longitude");

    // Query services by service type
    const services = await Service.find({ service_category: serviceType });

    // Calculate the distance between the given latitude and longitude and each service's latitude and longitude
    const distances = services.map(service => {
      const serviceLatitude = service.latitude;
      const serviceLongitude = service.longitude;
      const distance = Math.sqrt(Math.pow(serviceLatitude - latitude, 2) + Math.pow(serviceLongitude - longitude, 2));
      return { service, distance };
    });

    // Sort the services by distance in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Extract services from sorted distances
    const sortedServices = distances.map(distance => distance.service);

    console.log("Services sorted by closest distance:", sortedServices);
    res.json({ msg: "Services sorted by closest distance", data: sortedServices });
  } catch (error) {
    console.error("Error finding closest services:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});


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


/*

-------------------  ADDED NEW APIS HERE   ----------------------------

*/

// Admin can only add or delete a service. 
//Vendor can add/edit/delete his service.
// Vendor can also add/edit/delete a package of his service


router.post('/addService', authenticate, authorization,vendorApprovalMiddleware, async (req, res) => {
  try {
    let vendorId;
    if (req.user.role === "admin") {
      vendorId = req.body.vendor_id;
    } else if (req.user.role === "vendor") {
      vendorId = req.user.id;
    } else {
      return res.status(403).json({ msg: "Unauthorized access" });
    }
    console.log("Vendor ID:", vendorId);


    // Extract common service details from the request body
    const { staff, cancellation_policy, service_name, service_category, description, start_price, packages, latitude, longitude, city, area } = req.body;
 // Check if the service name already exists within the specified service category
 const existingService = await BaseService.findOne({ service_name: service_name, service_category: service_category });

 if (existingService) {
   return res.status(400).json({ msg: "Service name already exists within the specified category" });
 }

    let newService;

    // Determine the service category and create the appropriate service instance
    switch (service_category) {
      case 'catering':
        const { cuisine } = req.body;
        newService = new CateringService({
          vendor_id: vendorId,
          staff,
          cancellation_policy,
          service_name,
          service_category,
          description,
          start_price,
          packages,
          latitude,
          longitude,
          city,
          area,
          cuisine
        });
        break;
      case 'decor':
        const { decortype } = req.body;
        newService = new DecorService({
          vendor_id: vendorId,
          staff,
          cancellation_policy,
          service_name,
          service_category,
          description,
          start_price,
          packages,
          latitude,
          longitude,
          city,
          area,
          decortype
        });
        break;
      case 'photography':
        const { drone } = req.body;
        newService = new PhotographyService({
          vendor_id: vendorId,
          staff,
          cancellation_policy,
          service_name,
          service_category,
          description,
          start_price,
          packages,
          latitude,
          longitude,
          city,
          area,
          drone
        });
        break;
      case 'venue':
        const { capacity, outdoor } = req.body;
        newService = new VenueService({
          vendor_id: vendorId,
          staff,
          cancellation_policy,
          service_name,
          service_category,
          description,
          start_price,
          packages,
          latitude,
          longitude,
          city,
          area,
          capacity,
          outdoor
        });
        break;
      default:
        return res.status(400).json({ msg: "Invalid service category" });
    }

    // Save the new service to the database
    await newService.save();

    res.status(201).json({ msg: 'Service added successfully!', service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// Edit service API - TESTED
router.put('/editService/:serviceId', authenticate, vendorMiddleware,vendorApprovalMiddleware, async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    console.log("Editing service with ID:", serviceId);

    // Check if the service exists
    const existingService = await BaseService.findById(serviceId);
    if (!existingService) {
      console.log("Service not found");
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the vendor is authorized to edit this service
    if (existingService.vendor_id.toString() !== req.user.id) {
      console.log("Unauthorized to edit this service");
      return res.status(403).json({ msg: "Unauthorized to edit this service" });
    }

    console.log("Service found. Updating...");

    // Update common service details if provided
    existingService.staff = req.body.staff || existingService.staff;
    existingService.cancellation_policy = req.body.cancellation_policy || existingService.cancellation_policy;
    existingService.service_name = req.body.service_name || existingService.service_name;
    existingService.description = req.body.description || existingService.description;
    existingService.start_price = req.body.start_price || existingService.start_price;
    existingService.latitude = req.body.latitude || existingService.latitude;
    existingService.longitude = req.body.longitude || existingService.longitude;
    existingService.city = req.body.city || existingService.city;
    existingService.area = req.body.area || existingService.area;

    // Update packages if provided
    if (req.body.packages && req.body.packages.length > 0) {
      req.body.packages.forEach(pkg => {
        const packageIndex = existingService.packages.findIndex(p => p._id.toString() === pkg._id.toString());
        if (packageIndex !== -1) {
          existingService.packages[packageIndex].name = pkg.name || existingService.packages[packageIndex].name;
          existingService.packages[packageIndex].price = pkg.price || existingService.packages[packageIndex].price;
          existingService.packages[packageIndex].description = pkg.description || existingService.packages[packageIndex].description;
        }
      });

      console.log("Packages updated");
    }

    console.log("Service details updated");

    // Save the updated service to the database
    await existingService.save();

    console.log("Service saved to the database");

    // Update service specific details based on service category
    switch (existingService.service_category) {
      case 'catering':
        existingService.cuisine = req.body.cuisine || existingService.cuisine;
        console.log("Catering service details updated");
        break;
      case 'decor':
        existingService.decortype = req.body.decortype || existingService.decortype;
        console.log("Decor service details updated");
        break;
      case 'photography':
        existingService.drone = req.body.drone || existingService.drone;
        console.log("Photography service details updated");
        break;
      case 'venue':
        existingService.capacity = req.body.capacity || existingService.capacity;
        existingService.outdoor = req.body.outdoor || existingService.outdoor;
        console.log("Venue service details updated");
        break;
      default:
        console.log("Invalid service category");
        return res.status(400).json({ msg: "Invalid service category" });
    }

    res.status(200).json({ msg: 'Service updated successfully!', service: existingService });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// API to update a specific package of a service -- TESTED 
router.put('/editPackage/:serviceId/:packageId', authenticate, vendorMiddleware,vendorApprovalMiddleware, async (req, res) => {
  try {
    const { serviceId, packageId } = req.params;

    // Check if the service exists
    const existingService = await BaseService.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the vendor is authorized to edit this service
    if (existingService.vendor_id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to edit this service" });
    }

    // Find the package to update
    const packageToUpdate = existingService.packages.find(pkg => pkg._id.toString() === packageId);
    if (!packageToUpdate) {
      return res.status(404).json({ msg: "Package not found" });
    }

    // Update only the fields provided in the request body
    Object.assign(packageToUpdate, req.body);

    // Save the updated service to the database
    await existingService.save();

    res.status(200).json({ msg: 'Package updated successfully!', package: packageToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


router.post('/addPackage/:serviceId', authenticate, vendorMiddleware, vendorApprovalMiddleware, async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // Check if the service exists
    const existingService = await BaseService.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the vendor is authorized to add a package to this service
    if (existingService.vendor_id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to add a package to this service" });
    }

    // Create a new package object
    const newPackage = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description
    };

    existingService.packages.push(newPackage);
    await existingService.save();

    res.status(201).json({ msg: 'Package added successfully!', package: newPackage });
  } catch (error) {
    console.error("Error adding package:", error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


router.post('/deletePackage/:serviceId/:packageId', authenticate, vendorMiddleware,vendorApprovalMiddleware, async (req, res) => {
  try {
    const { serviceId, packageId } = req.params;

    // Check if the service exists
    const existingService = await BaseService.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the vendor is authorized to delete this package
    if (existingService.vendor_id.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to delete this package" });
    }

    // Find the index of the package to delete
    const packageIndex = existingService.packages.findIndex(pkg => pkg._id.toString() === packageId);
    if (packageIndex === -1) {
      return res.status(404).json({ msg: "Package not found" });
    }

    // Remove the package from the packages array
    existingService.packages.splice(packageIndex, 1);

    // Save the updated service to the database
    await existingService.save();

    res.status(200).json({ msg: 'Package deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// Delete any service. -- TESTED
router.post('/deleteService/:serviceId', authenticate, authorization, vendorApprovalMiddleware, async (req, res) => {
  try {
    const serviceId = req.params.serviceId;

    // Check if the service exists
    const existingService = await BaseService.findById(serviceId);
    if (!existingService) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // Check if the vendor is authorized to delete this service
    if (existingService.vendor_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized to delete this service" });
    }

    // Remove the service from the database
    await BaseService.deleteOne({ _id: serviceId });

    res.status(200).json({ msg: 'Service deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


module.exports = router;