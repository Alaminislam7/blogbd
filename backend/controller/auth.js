const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const shortId = require('shortid');


exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile)
}


exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }

        const { name, email, password } = req.body;
        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let newUser = new User({ name, email, password, profile, username });

        newUser.save((err, success) => {
            if (err) {
                console.log('SIGNUP ERROR', err);
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: 'Signup success! Please signin'
            });
        });
    });

};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        });
    });
};

exports.requireSignin = expressJwt({ 
    secret:  process.env.JWT_SECRET, algorithms: ['HS256'] 
});


exports.authMiddleware = (req, res, next) => {
    const authUserId = req.user._id;

    User.findById({ _id: authUserId }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        req.profile = user;
        next();
    });
};

exports.adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== 1) {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: "Signout success"
    })
}




