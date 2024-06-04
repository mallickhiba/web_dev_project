const express = require("express");
const Booking = require("../models/Bookings");
const Service = require("../models/Services"); // Import the Service model/schema
const User = require("../models/User");
const customerMiddleware = require("../middlewares/customerMiddleware");
const authenticate = require("../middlewares/authenticate");
const adminMiddleware = require("../middlewares/adminMiddleware");
const vendorMiddleware = require("../middlewares/vendorMiddleware");
const transporter = require('../emailService.js'); 


const router = express.Router();

// NEED TO MAKE API TO CHECK FOR AVILABILITY AS WELL

// GET all bookings (only for admin) can filter based on status and can sort in asc or desc order ****TESTED***
router.get("/allBookings", authenticate, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const statusFilter = req.query.status;
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const query = {};

    if (
      statusFilter &&
      ["pending", "confirmed", "cancelled"].includes(statusFilter)
    ) {
      query.status = statusFilter;
    }

    let sortQuery = {};

    sortQuery["bookingDate"] = sortOrder;

    const totalRecords = await Booking.countDocuments(query);

    const total_pages = Math.ceil(totalRecords / limit);
    const startIndex = (page - 1) * limit;

    console.log("Constructed Query:", query);

    const bookings = await Booking.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort(sortQuery)
      .populate({
        path: "customer",
        select: "firstName lastName email",
      })
      .populate({
        path: "service_id",
        select: "service_name service_category",
      })
      .populate({
        path: "vendor_id",
        select: "firstName lastName email",
      });

    const pagination = {
      offset: startIndex,
      records_per_page: limit,
      total_records: totalRecords,
      total_pages: total_pages,
      current_page: page,
    };

    res.status(200).json({ bookings, pagination });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET booking api for customer (this gives all bookings of a customer and customer can sort bookings based on status or booking date)
// ****TESTED****
router.get(
  "/customerBookings",
  authenticate,
  customerMiddleware,
  async (req, res) => {
    try {
      const statusFilter = req.query.status;
      const sortDirection = req.query.sort; // Added sort direction parameter
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;

      const query = { customer: req.user.id };
      if (
        statusFilter &&
        ["pending", "confirmed", "cancelled"].includes(statusFilter)
      ) {
        query.status = statusFilter;
      }

      let sortQuery = {}; // Define empty sort query object

      if (sortDirection === "asc") {
        sortQuery = { bookingDate: 1 }; // Sort by booking date in ascending order
      } else if (sortDirection === "desc") {
        sortQuery = { bookingDate: -1 }; // Sort by booking date in descending order
      }

      const totalCount = await Booking.countDocuments(query);

        const bookings = await Booking.find(query)
            .populate({
                path: 'service_id',
                select: 'service_name service_category'
            })
            .populate({
                path: 'vendor_id',
                select: 'firstName lastName email'
            })
            .sort(sortQuery) // Apply sorting based on sortQuery
            .limit(limit)
            .skip(startIndex);

      const totalPages = Math.ceil(totalCount / limit);

      const pagination = {
        offset: startIndex,
        records_per_page: limit,
        total_records: totalCount,
        total_pages: totalPages,
        current_page: page,
      };

      res.status(200).json({ bookings, pagination });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

/*
Get API  for vendor to view all bookings made for services by him. includes sort in asc or desc by booking date and filter by status
****TESTED***
 */
router.get(
  "/vendorBookings",
  authenticate,
  vendorMiddleware,
  async (req, res) => {
    try {
      const statusFilter = req.query.status;
      const sortDirection = req.query.sort; // Added sort direction parameter
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;

      const query = {
        vendor_id: req.user.id, // Filter by vendor ID
      };

      if (
        statusFilter &&
        ["pending", "confirmed", "cancelled"].includes(statusFilter)
      ) {
        query.status = statusFilter;
      }

      let sortQuery = {}; // Define empty sort query object

      if (sortDirection === "asc") {
        sortQuery = { bookingDate: 1 }; // Sort by booking date in ascending order
      } else if (sortDirection === "desc") {
        sortQuery = { bookingDate: -1 }; // Sort by booking date in descending order
      }
      const totalCount = await Booking.countDocuments(query);

        const bookings = await Booking.find(query)
            .populate({
                path: 'customer',
                select: 'firstName lastName email'
            })
            .populate({
                path: 'service_id',
                select: 'service_name service_category'
            }).populate({
                path: 'vendor_id',
                select: 'firstName lastName email'
            })
            .sort(sortQuery) // Apply sorting based on sortQuery
            .limit(limit)
            .skip(startIndex);

      const totalPages = Math.ceil(totalCount / limit);

      const pagination = {
        offset: startIndex,
        records_per_page: limit,
        total_records: totalCount,
        total_pages: totalPages,
        current_page: page,
      };

      res.status(200).json({ bookings, pagination });
    } catch (error) {
      console.error("Error fetching vendor bookings:", error); // Log any error that occurs
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// POST a new booking. only customer can make bookings ****TESTED***
router.post(
  "/createBooking",
  authenticate,
  customerMiddleware,
  async (req, res) => {
    try {
        const customerID = req.user.id;

        if (!req.body.bookingDate || !req.body.service || !req.body.service.service_id || !req.body.service.selected_package || !req.body.service.selected_package.package_id || !req.body.service.selected_package.name || req.body.guests == null) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Extract vendor_id from service_id
        const service = await Service.findById(req.body.service.service_id);
        if (!service) {
            return res.status(404).json({ message: "Service not found." });
        }

        const vendor_id = service.vendor_id; // Assuming the vendor_id is stored in the service document

        // Create booking data object
        const bookingData = {
            customer: customerID,
            service_id: req.body.service.service_id,
            selected_package: {
                package_id: req.body.service.selected_package.package_id,
                name: req.body.service.selected_package.name,
            },
            vendor_id: vendor_id, // Set vendor_id to the extracted vendor_id
            guests: req.body.guests,
            bookingDate: req.body.bookingDate,
        };

      // Create new booking
      const newBooking = await Booking.create(bookingData);
      res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    console.log(req.body.customer_id)

    const customer = await User.findById(req.body.customer_id);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: 'Booking Created',
      text: `Your booking has been created! You will recieve an email update when it is confirmed`
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send('Error sending email');
      } else {
          console.log('Email sent: ' + info.response);
          return res.send('Email sent to customer');
      }
  });


  }
);

// PUT endpoint to change booking status. Only vendor can do this.
router.put('/changeBookingStatus/:bookingId/:newStatus', authenticate, vendorMiddleware, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const newStatus = req.params.newStatus.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        const vendorId = req.user.id;

        // Check if the booking belongs to the vendor
        const booking = await Booking.findOne({ _id: bookingId, vendor_id: vendorId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found or does not belong to the vendor." });
        }
        // Check for valid status
        if (!["pending", "confirmed", "cancelled"].includes(newStatus)) {
            return res.status(400).json({ message: "Invalid status. Allowed values: 'pending', 'confirmed', 'cancelled'." });
        }

        // Update the booking status
        booking.status = newStatus;
        await booking.save();
        console.log("Booking updated");

        // Send response
        res.status(200).json({ message: "Booking status updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    const customer = await User.findById(req.body.customer_id);
    if (newStatus == 'confirmed'){
    const mailOptions2 = {
      from: process.env.EMAIL_USER,
      to: customer.email,
      subject: 'Booking Confirmed',
      text: `Yay! Your booking has been confirmed`
  };
  transporter.sendMail(mailOptions2, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send('Error sending email');
      } else {
          console.log('Email sent: ' + info.response);
          return res.send('Confirmation mail sent to customer');
      }
  });}
});

// DELETE a booking by ID. Only admin can do this.
router.delete(
  "/deleteBooking/:bookingId",
  authenticate,
  vendorMiddleware,
  async (req, res) => {
    try {
      console.log("delete api called");
      const bookingId = req.params.bookingId;

      // Find the booking by ID
      const booking = await Booking.findByIdAndDelete(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }

      res.status(200).json({ message: "Booking deleted successfully." });
      console.log("booking deleted");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
