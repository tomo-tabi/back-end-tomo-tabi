const express = require('express');

const router = express.Router();
const timelineCtrl = require('../../controllers/timeline/timelineController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');

router.use(authenticateToken);

router.get('/:tripid', userToTrip, timelineCtrl.getEvents);
router.post('/create', userToTrip, timelineCtrl.createEvent);
router.put('/update/:eventid', userToTrip, timelineCtrl.updateEvent);
router.delete('/delete/:eventid', userToTrip, timelineCtrl.deleteEvent);

module.exports = router;
