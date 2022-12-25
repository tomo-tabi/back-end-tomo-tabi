const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const { authenticateToken } = require('../../controllers/validation/auth');

// TODO: add JWT parsing and input validation
router.get('/', authenticateToken, userController.getUserById);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.put('/update', userController.putUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;
