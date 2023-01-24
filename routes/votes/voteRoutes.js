const express = require('express');

const router = express.Router();
const voteCtrl = require('../../controllers/votes/voteController');
const { authenticateToken } = require('../../middleware/auth');

router.use(authenticateToken);

router.get('/:eventid', voteCtrl.getVotes);
router.get('/:eventid/user', voteCtrl.getUserVote);
router.post('/yes/:eventid', voteCtrl.createYesVote);
router.post('/no/:eventid', voteCtrl.createNoVote);
router.put('/yes/:voteid', voteCtrl.updateToYesVote);
router.put('/no/:voteid', voteCtrl.updateToNoVote);
router.delete('/:voteid', voteCtrl.deleteVote);

module.exports = router;
