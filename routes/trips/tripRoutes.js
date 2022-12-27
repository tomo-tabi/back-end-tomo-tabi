const express = require('express');
const router = express.Router();
const tripCtrl = require('../../controllers/trips/tripController');
const { authenticateToken } = require('../../middleware/auth');

// TODO: add limit
router.get('/', authenticateToken, tripCtrl.getTrips);
router.post('/', tripCtrl.createTrip);
router.put('/:tripID', tripCtrl.updateTrip);
router.delete('/:tripID', tripCtrl.deleteTrip);

module.exports = router;
