const express = require('express');
const router = express.Router();
const busboy = require('connect-busboy');

const { createEvent } = require('../controllers/espControllers.js');

// Execute createEvent from the controllers directory with busboy methods executed immediately
router.post('/event', busboy({ immediate: true }), createEvent); 

module.exports = router;