const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  package_id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
});

const ServiceSchema = new mongoose.Schema({

  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
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
    min: 1,
    max: 5,
  }
});


ServiceSchema.pre('save', async function(next) {
  const service = this;
  if (!service.isModified('packages')) {
    // This will increment package IDs when a new package is added
    const packagesCount = service.packages.length;
    if (packagesCount === 0) {
      // If there are no packages, then set the package ID to 1
      service.packages.forEach((pkg, index) => {
        pkg.package_id = index + 1;
      });
    } else {
      // Set the package ID to the next number.
      const lastPackageId = service.packages[packagesCount - 1].package_id;
      service.packages.forEach((pkg, index) => {
        pkg.package_id = lastPackageId + index + 1;
      });
    }
  }
  next();
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
