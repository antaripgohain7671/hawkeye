const mongoose = require('mongoose');

// Event schema
const eventSchema = mongoose.Schema({
    images: [String]
}, {
    timestamps: true
});

// Event model
const Event = mongoose.model('Event', eventSchema);

module.exports =  Event;