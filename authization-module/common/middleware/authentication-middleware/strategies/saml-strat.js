module.exports = function () {

    const SamlStrategy = require('passport-saml').Strategy,
        saml = require('../../../config/config').office365_saml,
        usernameLink = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
        strategyCallback = require('./strats-utils');

    return new SamlStrategy({
            callbackUrl: saml.callbackUrl,
            entryPoint: saml.entryPoint,
            issuer: saml.issuer,
            cert: saml.certificate,
            signatureAlgorithm: 'sha256'
        },
        (profile, done) => strategyCallback(profile.nameID, 'saml', profile[usernameLink], 'EasterEgg123', 'saml', 'office365', done));
}
