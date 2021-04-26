const { Event } = require('../models/eventModel');

const fetchEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } 
    catch (error) { res.status(404).json({ message: error.message }) }
}


module.exports = { fetchEvents }