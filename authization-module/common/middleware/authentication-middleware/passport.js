
const
    passport = require('passport'),
    passportUtils = require('../../util/passport-utils');

// Setup available authentication strategies
passport.use('saml', require('./strategies/saml-strategy')());
passport.use('openid', require('./strategies/open-id-strategy'));
passport.use('azure_ad_oauth2', require('./strategies/azure-ad-oauth2-strategy')());
passport.use('google', require('./strategies/google-strategy')());
passport.use('local', require('./strategies/local-strategy')());

/**
 *
 * @param userRef - userId usually
 * @param done - callback
 */
const refToUser= (userRef, done)=> {
    passportUtils.findUser(userRef)
        .then(user => (user) ? done(null, user) : done('User unknown'));
};

/**
 *
 * @param user
 * @param done - callback
 */
const userToRef=(user, done)=> {
    done(null, user.id);
};

passport.serializeUser(userToRef);
passport.deserializeUser(refToUser);

module.exports = passport;
