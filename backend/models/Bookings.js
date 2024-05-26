const mongoose = require('mongoose');


const BookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    service: {
        type: {
            service_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Service',
                required: true
            },
            selected_package: {
                type: {
                    package_id: { type: Number, required: true },
                    name: { type: String, required: true },
                },
                required: true
            }
        },
        required: true
    },
    guests: {
        type: Number,
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
