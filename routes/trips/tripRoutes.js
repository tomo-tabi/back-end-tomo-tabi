const express = require('express');
const router = express.Router();
const tripCtrl = require('../../controllers/trips/tripController');
const { authenticateToken } = require('../../middleware/auth');

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

// routes
router.get('/', tripCtrl.getTrips);
router.post('/', tripCtrl.createTrip);
router.put('/:tripid', tripCtrl.updateTrip);
router.delete('/:tripid', tripCtrl.deleteTrip);

module.exports = router;
