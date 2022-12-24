const express = require('express');
const router = express.Router();
const tripController = require('../../controllers/trips/tripController');

// TODO: add limit
router.get('/', tripController.getTrips);
router.post('/', tripController.createTrip);
router.put('/:tripID', tripController.updateTrip);
router.delete('/', tripController.deleteTrip);

module.exports = router;
