const express = require('express');

const router = express.Router();
const inviteCtrl = require('../../controllers/invites/inviteController');
const { authenticateToken } = require('../../middleware/auth');
const { exitOnLocked } = require('../../middleware/permissions');
const {
  emailFormat,
  exitOnEmailNotExists,
  userToTrip,
} = require('../../middleware/validate');

router.use(authenticateToken);

router.get('/', inviteCtrl.getInvites);
router.get('/sent/:tripid', userToTrip, inviteCtrl.getSentInvites);
router.post(
  '/create',
  emailFormat,
  exitOnEmailNotExists,
  userToTrip,
  exitOnLocked,
  inviteCtrl.createInvite
);
router.put('/accept/:inviteid', inviteCtrl.acceptInvite);
router.put('/reject/:inviteid', inviteCtrl.rejectInvite);
router.delete('/:inviteid', userToTrip, exitOnLocked, inviteCtrl.deleteInvite);

module.exports = router;
