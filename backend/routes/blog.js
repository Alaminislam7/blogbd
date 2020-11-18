const express = require('express');
const router = express.Router()
const { time } = require('../controller/blog')


router.get('/blogs', time), 



module.exports = router


