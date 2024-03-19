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
    admin: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
    },
);

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;