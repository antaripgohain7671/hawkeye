/*
    NOTE:

    This file has the logic for handling all the API requests for the microcontroller (thiswebsite.com/esp/whatever)
    The functions defined here are called by the router scripts in the ../routes directory
*/

// To classify incoming images (detect a package / carton)
const { classify } = require('../ml/classifier');

// To create new entry in db after a new package is detected
const { Event } = require('../models/eventModel');
// Post images from esp to report an event
const createEvent = (req, res) => {
    if (!req.busboy) throw new Error('file binary data cannot be null');

    let fileData = null;
    let token = null;

    req.busboy.on('file', (fieldName, file) => {
        file.on('data', (data) => {
            if (fileData === null) { fileData = data; }
            else { fileData = Buffer.concat([fileData, data]); }
        });
    });

    req.busboy.on('field', (fieldName, value) => {
        if (fieldName === 'token') {
            token = value;
        }
    });

    req.busboy.on('finish', () => {
        if (!fileData) throw new Error('file binary data cannot be null');
        // if (!token)     throw new Error('No security token was passed');

        classify('mobilenet/model.json', fileData, async (result) => {
            try {
                if ((result.detectedObj == "carton" || result.detectedObj == "packet") && result.probability > 0.2) {
                        const newEvent = new Event(["no images for now, but definitely a package has arrived"]);
                        await newEvent.save();
                }
            } catch (error) {
                console.error(error)
            }
            res.send("Done");
        });
    });
}


const fetchEvents = async (req, res) => {
    try {
        const events = await Event.find();
        console.log(events);
        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}


module.exports = {
    createEvent,
    fetchEvents
}