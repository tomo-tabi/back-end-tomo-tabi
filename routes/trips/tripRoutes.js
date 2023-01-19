const express = require('express');

const router = express.Router();
const tripCtrl = require('../../controllers/trips/tripController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

// routes
router.get('/', tripCtrl.getTrips);
router.get('/users/:tripid', userToTrip, tripCtrl.getTripUsers);
router.post('/', tripCtrl.createTrip);
router.put('/:tripid', userToTrip, tripCtrl.updateTrip);
router.delete('/:tripid', tripCtrl.deleteTrip);

module.exports = router;
