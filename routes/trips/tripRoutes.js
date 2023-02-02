const express = require('express');

const router = express.Router();
const tripCtrl = require('../../controllers/trips/tripController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');
const { exitOnLocked, isOwner } = require('../../middleware/permissions');

router.use(authenticateToken);

router.get('/', tripCtrl.getTrips);
router.get('/users/:tripid', userToTrip, tripCtrl.getTripUsers);
router.get('/:tripid/locked', userToTrip, tripCtrl.getIsLockedForUser);
router.get('/:tripid/owner', userToTrip, tripCtrl.getUserIsOwner);
router.post('/', tripCtrl.createTrip);
router.put('/:tripid', userToTrip, exitOnLocked, tripCtrl.updateTrip);
router.put('/:tripid/lock', isOwner, tripCtrl.lockTrip);
router.put('/:tripid/unlock', isOwner, tripCtrl.unlockTrip);
router.delete('/:tripid', tripCtrl.deleteTripFromUser);

module.exports = router;
