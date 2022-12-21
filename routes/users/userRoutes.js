const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/userController');

router.get('/:userid', userController.getUserById);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.put('/update', userController.putUser);
router.delete('/delete', userController.deleteUser);

module.exports = router;
