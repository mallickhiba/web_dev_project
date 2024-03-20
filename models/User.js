const mongoose = require("mongoose");

const baseOptions = {
    discriminatorKey: "type",
    collection: "user",
};

const baseUserSchema = new mongoose.Schema(
    {
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
        createdAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    },
    baseOptions
);


// Define the Customer schema
const CustomerSchema = new mongoose.Schema({
    favourites: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
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

// Define the Admin schema
const AdminSchema = new mongoose.Schema({
    admin: {
        type: Boolean,
        default: true
    }
});

// Create the base model
const User = mongoose.model('User', baseUserSchema);

// Create discriminators for different roles
User.discriminator('Customer', CustomerSchema);
User.discriminator('Vendor', VendorSchema);
User.discriminator('Admin', AdminSchema);

module.exports = User;
