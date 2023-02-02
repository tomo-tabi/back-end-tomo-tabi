const express = require('express');

const router = express.Router();
const timelineCtrl = require('../../controllers/timeline/timelineController');
const { authenticateToken } = require('../../middleware/auth');
const { exitOnLocked } = require('../../middleware/permissions');
const { userToTrip } = require('../../middleware/validate');

router.use(authenticateToken);

router.get('/:tripid', userToTrip, timelineCtrl.getEvents);
router.post('/create', userToTrip, exitOnLocked, timelineCtrl.createEvent);
router.put(
  '/update/:eventid',
  userToTrip,
  exitOnLocked,
  timelineCtrl.updateEvent
);
router.delete(
  '/delete/:eventid',
  userToTrip,
  exitOnLocked,
  timelineCtrl.deleteEvent
);

module.exports = router;
