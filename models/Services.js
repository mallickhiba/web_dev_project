const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  packages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  }],
  service_name: {
    type: String,
    required: true
  },
  cancellation_policy: {
    type: String,
    enum: ['Flexible', 'Moderate', 'Strict'],
    required: true
  },
  staff: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
