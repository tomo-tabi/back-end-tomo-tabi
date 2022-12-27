const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');
const { authenticateToken } = require('../../middleware/auth');

// routes that don't require jwt authentication
router.post('/login', userController.login);
router.post('/signup', userController.signup);

// require jwt authentication for all subsequent requests
router.use(authenticateToken);

router.get('/', userController.getUser);
router.put('/update', userController.putUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;
