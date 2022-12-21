const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');

router.get('/:userid', userController.getUserById);
router.post('/register/', userController.signup);
router.post('/signin', userController.signin);
module.exports = router;
