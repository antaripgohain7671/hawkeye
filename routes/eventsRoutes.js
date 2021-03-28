const express = require('express');
const router = express.Router();
const busboy = require('connect-busboy');

const { createEvent, fetchEvents } = require('../controllers/eventsControllers.js');

// Add new event - Used by the esp controller
router.post('/', busboy({ immediate: true }), createEvent);    //  Second param ensures busboy methods are executed immediately

// Fetch all events - Used by the frontend react app
router.get('/', fetchEvents);

module.exports = router;