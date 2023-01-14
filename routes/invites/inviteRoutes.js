const express = require('express');
const router = express.Router();
const inviteCtrl = require('../../controllers/invites/inviteController');
const { authenticateToken } = require('../../middleware/auth');
const { userToTrip } = require('../../middleware/validate');

// require jwt authentification for all subsequent requests
router.use(authenticateToken);

router.get('/', userToTrip, inviteCtrl.getInvites);
router.post('/create', userToTrip, inviteCtrl.createInvite);
router.put('/update/:inviteid', inviteCtrl.updateInvite);
router.delete('/:inviteid', userToTrip, inviteCtrl.deleteInvite);

module.exports = router;
