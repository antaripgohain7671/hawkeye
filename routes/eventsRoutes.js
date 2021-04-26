const express = require('express');
const router = express.Router();

const { fetchEvents } = require('../controllers/eventsController.js');

// Fetch all events - Used by the frontend react app
router.get('/', fetchEvents);

module.exports = router;