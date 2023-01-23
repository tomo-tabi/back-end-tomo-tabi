const express = require('express');

const router = express.Router();
const userCtrl = require('../../controllers/users/userController');
const { emailFormat, exitOnEmailExists } = require('../../middleware/validate');
const { authenticateToken } = require('../../middleware/auth');

// routes that don't require jwt authentication
router.post('/login', emailFormat, userCtrl.login);
router.post('/signup', emailFormat, exitOnEmailExists, userCtrl.signup);

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

router.get('/', userCtrl.getUser);
router.put('/update', emailFormat, exitOnEmailExists, userCtrl.putUser);
router.put('/password', userCtrl.putPassword);
router.delete('/delete', userCtrl.deleteUser);

module.exports = router;
