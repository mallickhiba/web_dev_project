const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3
  },
  phoneNumber: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'vendor'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { discriminatorKey: 'role' }); // Discriminator key placed here

// Define the Customer schema
const CustomerSchema = new mongoose.Schema({
  favourites: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Reference event schema using ObjectId
    default: []
  }
});

// Define the Vendor schema
const VendorSchema = new mongoose.Schema({
  approved: {
    type: Boolean,
    default: false
  }
});

// Create the discriminator models (after UserSchema)
const Customer = mongoose.model('Customer', UserSchema.discriminator('Customer', CustomerSchema));
const Vendor = mongoose.model('Vendor', UserSchema.discriminator('Vendor', VendorSchema));

// Create the base model (before discriminator models)
const User = mongoose.model('User', UserSchema);

// Export the models
module.exports = { User, Customer, Vendor };
