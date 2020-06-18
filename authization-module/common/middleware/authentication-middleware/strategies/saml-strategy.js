'use strict'

const config = require('../../../config/config')

const
    fs = require('fs'),
    path = require('path'),
    passportUtils = require('../../../util/passport-utils'),
    protocolName = 'Saml',
    SamlStrategy = new (require('passport-saml').Strategy)({

        callbackUrl: config.callbackUrl,
        entryPoint: config.entryPoint,
        issuer: config.issuer,
        cert: fs.readFileSync(path.join(__dirname, '../../../certificates/authentication-node.pem'), 'utf-8'),
        privateCert: fs.readFileSync(path.join(__dirname, '../../../certificates/privateKey.pem'), 'utf-8')

    }, async function (profile, done) {

        if (!(await passportUtils.checkProtocol(protocolName))) {
            done(null, false, { message: 'Protocol is not avaiable' })
            return
        }

        let user = await passportUtils.findUserByIdp(profile.nameID)

        if (!user) {
            user = await passportUtils.createUser(profile.nameID, 'saml', profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'], null)
        }
        if (await passportUtils.isBlackListed(user.id)) {
            passportUtils.addNotification(user.id)
            done(null, false, { message: 'User is BlackListed' })
            return
        }
        done(null, user)
    })

module.exports = SamlStrategy
