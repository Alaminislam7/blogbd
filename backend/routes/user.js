const express = require('express');
const router = express.Router();

// import controller
const { requireSignin, adminMiddleware } = require('../controller/auth');
const { read } = require('../controller/user');

router.get('/profile', requireSignin, adminMiddleware ,read);

module.exports = router;
