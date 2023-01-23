const express = require('express');

const router = express.Router();
const inviteCtrl = require('../../controllers/invites/inviteController');
const { authenticateToken } = require('../../middleware/auth');
const { emailFormat, emailExists } = require('../../middleware/validate');
const { userToTrip } = require('../../middleware/validate');

// require jwt authentification for all subsequent requests
router.use(authenticateToken);

router.get('/', inviteCtrl.getInvites);
router.post(
  '/create',
  emailFormat,
  emailExists,
  userToTrip,
  inviteCtrl.createInvite,
);
router.put('/accept/:inviteid', inviteCtrl.acceptInvite);
router.put('/reject/:inviteid', inviteCtrl.rejectInvite);
router.delete('/:inviteid', userToTrip, inviteCtrl.deleteInvite);

module.exports = router;
