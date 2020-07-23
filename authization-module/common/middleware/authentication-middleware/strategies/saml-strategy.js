
const config = require('../../../config/config');

const
    fs = require('fs'),
    path = require('path'),
    passportUtils = require('../../../util/passport-utils'),
    protocolName = 'Saml',
    SamlStrategy = new (require('passport-saml').Strategy)({

        callbackUrl: config.saml.callbackUrl,
        entryPoint: config.saml.entryPoint,
        issuer: config.saml.issuer,
        cert: fs.readFileSync(path.join(__dirname, '../../../certificates/AuthizationApplication.cer'), 'utf-8'),
        signatureAlgorithm:'sha256'

    }, async function (profile, done) {
        console.log('VAI COMEÇAR')
        if (!(await passportUtils.checkProtocol(protocolName))) {
            done(null, false, { message: 'Protocol is not avaiable' });
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
        console.log('CHEGOU AO FIM!')
        done(null, user);
    });

module.exports = SamlStrategy;
