const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
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
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
      }
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
