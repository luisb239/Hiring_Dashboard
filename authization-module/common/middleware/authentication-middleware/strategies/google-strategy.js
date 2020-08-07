
const
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    protocolName = 'Google',
    config = require('../../../config/config'),
    passportUtils = require('../../../util/passport-utils');

module.exports = () => {

    return new GoogleStrategy({
        clientID: config.google.google_client_id,
        clientSecret: config.google.google_client_secret,
        callbackURL: config.google.callbackUrl,
    },
        async function (accessToken, refreshToken, profile, done) {
            console.log(profile)
            if (await passportUtils.checkProtocol(protocolName)) {
                let user = await passportUtils.findUserByIdp(profile.id);
                if (!user) {
                    user = await passportUtils.createUser(profile.id, 'google', profile.displayName, "null");
                }
                if (await passportUtils.isBlackListed(user.id)) {
                    passportUtils.addNotification(user.id);
                    done(null, false, {message: 'User is BlackListed'});
                    return;
                }
                done(null, user);
            } else {
                done(null, false, {message: 'Protocol is not avaiable'});
            }
        }
    );
};
