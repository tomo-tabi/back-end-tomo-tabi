const express = require('express');

const router = express.Router();
const voteCtrl = require('../../controllers/votes/voteController');
const { authenticateToken } = require('../../middleware/auth');

router.use(authenticateToken);

module.exports = router;
