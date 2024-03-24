const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  package_id: { type: Number },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
});

const ServiceSchema = new mongoose.Schema({

  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packages: [PackageSchema],
  service_name: {
    type: String,
    required: true
  },
  service_type: {
    type: String,
    enum: ['decor', 'venue', 'catering', 'photography'],
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
  },
  start_price: {
    type: Number,
    required: true
  },
  average_rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  location_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },

});


ServiceSchema.pre('save', async function(next) {
  try {
    const service = this;
    // Check if the 'packages' field is modified or not
    if (service.isModified('packages')) {
      // Calculate the package_id for each package in the array
      service.packages.forEach((pkg, index) => {
        // Set the package_id to the next number
        pkg.package_id = index + 1;
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});
const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
