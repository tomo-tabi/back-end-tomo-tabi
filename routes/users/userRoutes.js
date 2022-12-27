const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const validate = require('../../middleware/validate');
const { authenticateToken } = require('../../middleware/auth');

// routes that don't require jwt authentication
router.post('/login', validate.emailFormat, userController.login);
router.post(
  '/signup',
  validate.emailFormat,
  validate.emailNotExists,
  userController.signup
);

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

router.get('/', userController.getUser);
router.put(
  '/update',
  validate.emailFormat,
  validate.emailNotExists,
  userController.putUser
);
router.delete('/delete', userController.deleteUser);

module.exports = router;
