const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const auth = require('../Controllers/middleware/auth');

router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.post('/loginoauth', UserController.oAuthLogin);

router.post('/logout', auth, UserController.logout);

router.post('/unlockpwd', auth, UserController.unlockPWD);

router.post('/updateme', auth, UserController.updateUser);

module.exports = router;