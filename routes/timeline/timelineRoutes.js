const express = require('express');
const router = express.Router();
const timelineCtrl = require('../../controllers/timeline/timelineController');
const { authenticateToken } = require('../../middleware/auth');

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

router.get('/:tripid', timelineCtrl.getEvents);
router.post('/create', timelineCtrl.createEvent);
router.put('/update/:eventid', timelineCtrl.updateEvent);
router.delete('/delete/:eventid', timelineCtrl.deleteEvent);

module.exports = router;
