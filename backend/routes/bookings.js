const express = require('express');
const Booking = require('../models/Bookings'); // Fix the file name to match the actual file name in a case-sensitive manner

const router = express.Router();

// GET all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific booking
router.get('/:id', getBooking, (req, res) => {
    res.json(res.booking);
});

// POST a new booking
router.post('/', async (req, res) => {
    const { date, service } = req.body; // Extract date and service from req.body
    const customer = req.body.customer; // Extract customer ID from req.body

    // Check if customer ID is provided
    if (!customer) {
        return res.status(400).json({ message: "Customer ID is required." });
    }

    const booking = new Booking({
        date: date,
        service: service,
        customer: customer // Include customer ID in the booking
    });

    try {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Middleware function to get a specific booking by ID
async function getBooking(req, res, next) {
    let booking;
    try {
        booking = await Booking.findById(req.params.id);
        if (booking == null) {
            return res.status(404).json({ message: 'Booking not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.booking = booking;
    next();
}

// DELETE a booking
router.delete('/:id', getBooking, async (req, res) => {
    try {
        await res.booking.remove();
        res.json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;