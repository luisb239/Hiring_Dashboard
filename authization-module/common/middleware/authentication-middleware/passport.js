const
    passport = require('passport'),
    config = require('../../config/config'),
    passportUtils = require('../../util/passport-utils')

// Setup available authentication strategies
config.office365_saml.callbackUrl && passport.use('office365_saml', require('./strategies/saml-strat')())
config.office365_oauth2.callbackUrl && passport.use('office365_oauth2', require('./strategies/azure-strat')());
config.google_oauth2.callbackUrl && passport.use('google_oauth2', require('./strategies/google-strat')());
passport.use('local', require('./strategies/local-strat')());


/**
 *
 * @param userRef - userId usually
 * @param done - callback
 */
const refToUser = (userRef, done) => {
    passportUtils.findUser(userRef)
        .then(user => (user) ? done(null, user) : done('User unknown'));
};

/**
 *
 * @param user
 * @param done - callback
 */
const userToRef = (user, done) => {
    done(null, user.id);
};

passport.serializeUser(userToRef);
passport.deserializeUser(refToUser);

module.exports = passport;
