var express = require('express');
var router = express.Router();
const passport = require('passport');
const config = require('../../config');
var { generateToken, sendToken } = require('../utils/token.utils');

require('../utils/passport')();
const {
  //signup,
  signin,
  signout,
} = require('../controllers/auth');

const { authValidationRules, validate } = require('../validators/auth');

/**
 * This function comment is parsed by doctrine
 * @route POST /signin
 * @group auth - Authentication APIs
 * @param {string} username.body.required - username or email - eg: user@domain
 * @param {string} password.body.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

router.post('/signin', authValidationRules(), validate, signin);

// signout route
router.get('/signout', signout);

router.route('/auth/facebook')
    .post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken);

router.route('/auth/google')
    .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken);


module.exports = router;
