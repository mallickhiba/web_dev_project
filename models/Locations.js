const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    areaName: {
        type: String,
        required: true
    },
    locationName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Location', locationSchema);

