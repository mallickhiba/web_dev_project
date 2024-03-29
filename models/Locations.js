const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    areaName: {
        type: String,
        enum: ['Gulshan-e-Iqbal', 'DHA', "North Nazimabad", "Other"]
    },
    locationName: {
        type: String,
        enum: ['Karachi', 'Lahore', 'Islamabad'],
        default: 'Karachi'
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    }
});

module.exports = mongoose.model('Location', locationSchema);

