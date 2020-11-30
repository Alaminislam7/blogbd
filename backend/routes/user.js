const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware, authMiddleware } = require('../controller/auth');
const { read, publicProfile, update, photo } = require('../controller/user');

router.get('/user/profile', requireSignin, authMiddleware ,read);
router.get('/user/:username', publicProfile);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);

module.exports = router;
