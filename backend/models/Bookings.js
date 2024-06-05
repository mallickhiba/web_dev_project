const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  selected_package: {
    type: {
      package_id: { type: Number, required: false },
      name: { type: String, required: true }
    },
    required: true,
  },
  
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  bookingDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
