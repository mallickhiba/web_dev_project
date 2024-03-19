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
    }}
);

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;