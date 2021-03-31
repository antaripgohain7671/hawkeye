/*
  NOTE:
  These schema and model defines a event that will be created when a package is detected
  A event only needs the pics and a timestamp
*/

const mongoose = require('mongoose');

// Event schema
const eventSchema = mongoose.Schema({
    image: String
}, {
    timestamps: true
});

// Event model
const Event = mongoose.model('Event', eventSchema);

module.exports =  { Event: Event };