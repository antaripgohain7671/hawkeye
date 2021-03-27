const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Post images from esp to report an event
router.post('/event', async (req, res) => {
    // TODO: Add logic to create event
});

module.exports = router;