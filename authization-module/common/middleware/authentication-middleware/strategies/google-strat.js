module.exports = function () {
    const GoogleStrategy = require('passport-google-oauth20').Strategy,
        google = require('../../../config/config').google_oauth2,
        strategyCallback = require('./strats-utils');

    return new GoogleStrategy({
            clientID: google.client_id,
            clientSecret: google.client_secret,
            callbackURL: google.callbackUrl,
        },
        (accessToken, refreshToken, profile, done) => strategyCallback(profile.id, 'google', profile.displayName, 'EasterEgg123', 'oauth2', 'google', done));

};
