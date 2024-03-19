const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
    required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
