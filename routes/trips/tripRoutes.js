const express = require('express');

const router = express.Router();
const tripCtrl = require('../../controllers/trips/tripController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');

router.use(authenticateToken);

router.get('/', tripCtrl.getTrips);
router.get('/users/:tripid', userToTrip, tripCtrl.getTripUsers);
router.post('/', tripCtrl.createTrip);
router.put('/:tripid', userToTrip, tripCtrl.updateTrip);
router.put('/:tripid/lock', userToTrip, tripCtrl.lockTrip);
router.put('/:tripid/unlock', userToTrip, tripCtrl.unlockTrip);
router.delete('/:tripid', tripCtrl.deleteTripFromUser);

module.exports = router;
