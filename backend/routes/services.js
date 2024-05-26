
var express = require("express");
const mongoose = require("mongoose");
const authenticate = require('../middlewares/authenticate.js');
const authorization = require('../middlewares/authorization.js');
const adminMiddleware = require('../middlewares/adminMiddleware');
const customerMiddleware = require('../middlewares/customerMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');
const Service = require('../models/Services'); // Add the missing import statement for the Service model
const Users = require('../models/User'); // Add the missing import statement for the Service model
const VenueService = require('../models/Services').model('VenueService');
const PhotographyService = require('../models/Services').model('PhotographyService');
const CateringService = require('../models/Services').model('CateringService');
const DecorService = require('../models/Services').model('DecorService');
var router = express.Router();
//*************************FOLLOWING APIS CAN BE ACCESSED WITHOUT LOGIN********************************************
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
    const photographys = await PhotographyService.find(filter)
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
      photographys
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

    // Populate service with packages and vendor name from the 'users' collection
    const services = await Service.find({ service_name: regex })
      .populate({
        path: 'vendor_id',
        model: 'Users', // Use the correct collection name here
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


// Getting Service based on ID-TESTED
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


// View Services by Service Category and Location ID with Pagination--Tested
router.get('/:serviceType/:locationId', async (req, res) => {
  const { serviceType, locationId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    if (!['decor', 'venue', 'catering', 'photography'].includes(serviceType)) {
      return res.status(400).json({ msg: "Invalid service type" });
    }

    // Query services by service type and location ID with pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalServices = await Service.countDocuments({ service_category: serviceType, location_id: locationId });
    const services = await Service.find({ service_category: serviceType, location_id: locationId })
      .limit(limit)
      .skip(startIndex);

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

//api to get service tpye in a specific city
router.get('/:serviceType/:city', async (req, res) => {
  try {
    const { serviceType, city } = req.params;
    
    if (!['Karachi', 'Lahore', 'Islamabad'].includes(city)) {
      return res.status(400).json({ msg: 'Invalid city' });
    }

    const services = await Service.find({ service_category: serviceType, city: city });
    if (services.length === 0) {
      return res.status(404).json({ msg: `No services found for ${serviceType} in ${city}` });
    }
    res.json({ msg: `Services found for ${serviceType} in ${city}`, data: services });
  } catch (error) {
    console.error('Error finding services:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});



//api to et service type by city AND AREA (AREA GOES IN REQ BODY ) - NOT TESTED
router.post('/:serviceType/:city', async (req, res) => {
  try {
    const { serviceType, city } = req.params;
    const { area } = req.body;
    
    if (!['Karachi', 'Lahore', 'Islamabad'].includes(city)) {
      return res.status(400).json({ msg: 'Invalid city' });
    }    const services = await Service.find({ service_category: serviceType, city: city, area: area });
    if (services.length === 0) {
      return res.status(404).json({ msg: `No services found for ${serviceType} in ${area}, ${city}` });
    }    res.json({ msg: `Services found for ${serviceType} in ${area}, ${city}`, data: services });
  } catch (error) {
    console.error('Error finding services:', error);
    res.status(500).json({ msg: 'Internal server error' });
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


//*************APIS  only work for vendors and admin but there is an issue with fetching id (will be an issue in the frontend)***************////
router.use(authenticate); 
router.use(authorization); 

// POST endpoint to add a new venue
router.post('/venue',authenticate,authorization,async (req, res) => {
  try {
    // Extract venue details from the request body
    const {vendor_id,staff, cancellation_policy, service_name,service_category, 
      description, start_price, location_id,packages,latitude,
      longitude, city,area,capacity, outdoor } = req.body;

    // Create a new venue service instance
    const newVenue = new VenueService({
      vendor_id,
      staff,
      cancellation_policy,
      service_name,
      service_category,
      description,
      start_price,
      location_id,
      packages, // Assuming packages are included in the request body,
      latitude,
      longitude,
      city,
      area,
      capacity,
      outdoor
    });

    // Save the new venue service to the database
    await newVenue.save();

    res.status(201).json({ msg: 'Venue added successfully!', venue: newVenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});


// POST endpoint to add a new photography service
router.post('/photography', authenticate, authorization, async (req, res) => {
  try {
    // Extract photography service details from the request body
    const { vendor_id, staff, cancellation_policy, service_name, service_category, description, 
      start_price, location_id, packages,latitude,    longitude,  city,area, drone } = req.body;

    // Create a new photography service instance
    const newPhotographyService = new PhotographyService({
      vendor_id,
      staff,
      cancellation_policy,
      service_name,
      service_category,
      description,
      start_price,
      location_id,
      packages, // Assuming packages are included in the request body
      latitude,
      longitude,
      city,
      area,
      drone
    });

    // Save the new photography service to the database
    await newPhotographyService.save();

    res.status(201).json({ msg: 'Photography service added successfully!', service: newPhotographyService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
// POST endpoint to add a new catering service
router.post('/catering', authenticate, authorization,async (req, res) => {
  try {
    // Extract catering service details from the request body
    const { vendor_id, staff, cancellation_policy, service_name, service_category, description, start_price, location_id, 
      packages,latitude,longitude, city,  area, cuisine } = req.body;

    // Create a new catering service instance
    const newCateringService = new CateringService({
      vendor_id,
      staff,
      cancellation_policy,
      service_name,
      service_category,
      description,
      start_price,
      location_id,
      packages, // Assuming packages are included in the request body
      latitude,
      longitude,
      city,
      area,
      cuisine
    });

    // Save the new catering service to the database
    await newCateringService.save();

    res.status(201).json({ msg: 'Catering service added successfully!', service: newCateringService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
 

// POST endpoint to add a new decor service
// POST endpoint to add a new decor service
router.post('/decor', authenticate,authorization, async (req, res) => {
  try {
    // Extract decor service details from the request body
    const { vendor_id, staff, cancellation_policy, service_name, service_category, description,
       start_price, location_id, packages,latitude,    longitude,   city, area, decortype } = req.body;

    // Create a new decor service instance
    const newDecorService = new DecorService({
      vendor_id,
      staff,
      cancellation_policy,
      service_name,
      service_category,
      description,
      start_price,
      location_id,
      packages, // Assuming packages are included in the request body
      latitude,
      longitude,
      city,
      area,
      decortype
    });

    // Save the new decor service to the database
    await newDecorService.save();

    res.status(201).json({ msg: 'Decor service added successfully!', service: newDecorService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
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
router.post("/create", vendorMiddleware,async (req, res) => {
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