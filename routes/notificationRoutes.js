const express = require('express');
const router = express.Router();

const { subscribeToPush } = require('../controllers/notificationController.js');

// Subscribe from frontend to recieve push notifications
router.get('/', subscribeToPush);

module.exports = router;