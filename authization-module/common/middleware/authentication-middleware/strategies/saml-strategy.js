
const config = require('../../../config/config'),
    SamlStrategy = require('passport-saml').Strategy,
    fs = require('fs'),
    path = require('path'),
    passportUtils = require('../../../util/passport-utils'),
    protocolName = 'Saml'

module.exports = () => {
    return new SamlStrategy({
        callbackUrl: config.saml.callbackUrl,
        entryPoint: config.saml.entryPoint,
        issuer: config.saml.issuer,
        cert: config.saml.certificate,
        signatureAlgorithm: 'sha256'

    }, async function (profile, done) {
        console.log('VAI COMEÇAR')
        if (!(await passportUtils.checkProtocol(protocolName))) {
            done(null, false, {message: 'Protocol is not avaiable'});
            return;
        }
        console.log('Passou o checkProtocol')
        console.log('Showing profile obj...')
        console.log(profile)
        let user = await passportUtils.findUserByIdp(profile.nameID);
        console.log(user)
        if (!user) {
            user = await passportUtils.createUser(profile.nameID, 'saml', profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'], 'null');
        }
        if (await passportUtils.isBlackListed(user.id)) {
            passportUtils.addNotification(user.id);
            done(null, false, { message: 'User is BlackListed' });
            return;
        }
        done(null, user);
    });

}
