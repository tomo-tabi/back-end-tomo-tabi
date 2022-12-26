const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const { authenticateToken } = require('../../controllers/validation/auth');

// routes that don't require jwt authentification
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// require jwt authentification for all subsequent requests
router.use(authenticateToken);

router.get('/', userController.getUserById);
router.put('/update', userController.putUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;
