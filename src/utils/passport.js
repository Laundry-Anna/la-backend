'use strict';

const passport = require('passport');
const Staff = require('../models/staff');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const config = require('../../config');

module.exports = function () {


    passport.use(new FacebookTokenStrategy({
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            Staff.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            });
    }));

    passport.use(new GoogleTokenStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            Staff.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            });
    }));
};