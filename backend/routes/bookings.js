const express = require('express');
const Booking = require('../models/Bookings')
const User = require('../models/User'); 
const customerMiddleware = require('../middlewares/customerMiddleware');
const authenticate = require('../middlewares/authenticate');
const adminMiddleware = require('../middlewares/adminMiddleware');
const vendorMiddleware = require('../middlewares/vendorMiddleware');


const router = express.Router();

// NEED TO MAKE API TO CHECK FOR AVILABILITY AS WELL

/****get booking apis are working but shows vendorID as null so need to be fixed***/

// GET all bookings (only for admin)
router.get('/allBookings', authenticate, adminMiddleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const statusFilter = req.query.status;
        const query = {};
        if (statusFilter && ['pending', 'confirmed', 'cancelled'].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const totalRecords = await Booking.countDocuments(query);

        const total_pages = Math.ceil(totalRecords / limit);
        const startIndex = (page - 1) * limit;
        
        const bookings = await Booking.find(query)
            .skip(startIndex)
            .limit(limit)
            .populate({
                path: 'customer',
                select: 'firstName lastName email' 
            })
            .populate({
                path: 'service.service_id',
                select: 'service_name service_category vendor_id', 
                populate: {
                    path: 'vendor_id',
                    model: 'User', 
                    select: 'firstName lastName' 
                }
            });

            const pagination = {
            offset: startIndex,
            records_per_page: limit,
            total_records: totalRecords,
            total_pages: total_pages,
            current_page: page
        };

        res.status(200).json({ bookings, pagination });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get('/customerBookings', authenticate, customerMiddleware, async (req, res) => {
    try {
        const statusFilter = req.query.status;
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 

        const startIndex = (page - 1) * limit;

        const query = { customer: req.user.id };
        if (statusFilter && ['pending', 'confirmed', 'cancelled'].includes(statusFilter)) {
            query.status = statusFilter;
        }
        const totalCount = await Booking.countDocuments(query);

        const bookings = await Booking.find(query)
            .populate({
                path: 'service.service_id',
                select: 'service_name service_category vendor_id',
                populate: {
                    path: 'vendor_id',
                    model: 'User',
                    select: 'firstName lastName'
                }
            })
            .limit(limit)
            .skip(startIndex);

        const totalPages = Math.ceil(totalCount / limit);

        const pagination = {
            offset: startIndex,
            records_per_page: limit,
            total_records: totalCount,
            total_pages: totalPages,
            current_page: page
        };

        res.status(200).json({ bookings, pagination });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


/*
Here we will have  api  for vendor to view all bookings made for this vendor.
*/

// POST a new booking ****TESTED***
router.post('/createBooking', authenticate, customerMiddleware, async (req, res) => {
    try {
        const customerID = req.user.id; 

        if (!req.body.date || !req.body.service || !req.body.service.service_id || !req.body.service.selected_package || !req.body.service.selected_package.package_id || !req.body.service.selected_package.name || req.body.guests == null) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Create booking data object
        const bookingData = {
            customer: customerID,
            date: req.body.date,
            service: {
                service_id: req.body.service.service_id,
                selected_package: {
                    package_id: req.body.service.selected_package.package_id,
                    name: req.body.service.selected_package.name,
                }
            },
            guests: req.body.guests,
        };

        // Create new booking
        const newBooking = await Booking.create(bookingData);
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// NOT TESTED 
router.post('/approveBooking/:bookingId',authenticate, vendorMiddleware, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const vendorId = req.user.id;

        const booking = await Booking.findById(bookingId).populate('service.service_id');
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.service.service_id.vendor_id.toString() !== vendorId) {
            return res.status(403).json({ message: "Unauthorized: You are not the owner of this booking" });
        }

        booking.status = "confirmed";
        await booking.save();

        res.status(200).json({ message: "Booking approved successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// NOT TESTED YET
router.post('/cancelBooking/:bookingId', authenticate, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const userId = req.user.id;

        const booking = await Booking.findById(bookingId).populate('service.service_id');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if the authenticated user is the owner of the booking (customer) or the owner of the service associated with the booking (vendor)
        if (booking.customer.toString() !== userId && booking.service.service_id.vendor_id.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized: You are not authorized to cancel this booking" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;