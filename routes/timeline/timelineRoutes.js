const express = require('express');
const router = express.Router();
const timelineCtrl = require('../../controllers/timeline/timelineController');
const { authenticateToken } = require('../../middleware/auth');

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

router.post('/create', timelineCtrl.createEvent);

module.exports = router;
