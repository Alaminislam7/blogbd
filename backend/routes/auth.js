const express = require('express');
const router = express.Router()

//import controler
const { signup,signin, signout, requireSignin } = require('../controller/auth')

//import validators
const { userSignupValidator,userSigninValidator } = require('../validators/auth');
const { runValidation } = require('../validators');



router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.get('/signout', signout)

//test
// router.get('/secret', requireSignin, (req, res) => {
//     res.json({
//         message: req.user
//     })
// })


module.exports = router