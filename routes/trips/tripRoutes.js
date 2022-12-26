const express = require('express');
const router = express.Router();
const tripController = require('../../controllers/trips/tripController');
const { authenticateToken } = require('../../controllers/validation/auth');

// TODO: add limit
router.get('/', authenticateToken, tripController.getTrips);
router.post('/', tripController.createTrip);
router.put('/:tripID', tripController.updateTrip);
router.delete('/:tripID', tripController.deleteTrip);

module.exports = router;
