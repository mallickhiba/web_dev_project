const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  pid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true }
});

const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;
