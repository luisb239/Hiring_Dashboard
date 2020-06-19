'use strict'

const passport = require('passport')
const passportUtils = require('../common/util/passport-utils')
const config = require('../common/config/config')

/*
function authCallback(err, user, info) {
    if (!user || err) {
        return next(err)
    }
    const options = async (err) => (err) ? next(err) : passportUtils.createUserSession(user.id, req.session.id).then(useless => next())
    return req.logIn(user, options)
}*/

module.exports = {

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingLocal: (req, res, next) => {
        passport.authenticate('local', { failWithError: true }, function (err, user) {
            if (!err && user) {
                passportUtils.createUserSession(user.id, req.session.id)
                req.logIn(user, function (error) {
                    if (error) { return next(error); }
                })
                return next()
            }
            next(err)
        })(req, res, next)

    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingGoogle: (req, res, next) => {
        passport.authenticate('google', { scope: ['profile'] })(req, res, next)
    },

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingGoogleCallback: (req, res, next) => {
        passport.authenticate('google', { failWithError: true }, function (err, user, info) {
            if (!user || err) {
                return next(err)
            }
            passportUtils.createUserSession(user.id, req.session.id)
            req.logIn(user, function (error) {
                if (error) { return next(error); }
            })
            return next();
        })(req, res, next)
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingSaml: (req, res, next) => {

        passport.authenticate('saml')(req, res, next)

    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingSamlCallback: (req, res, next) => {
        passport.authenticate('saml', { failWithError: true }, function (err, user, info) {
            if (!user || err) {
                return next(err)
            }
            req.logIn(user, function (error) {
                if (error) { return next(error); }
            })
            return next();
        })(req, res, next)
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingOpenId: (req, res, next) => {

    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingOffice365: (req, res, next) => {
        passport.authenticate('azure_ad_oauth2')(req, res, next)
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    usingOffice365Callback: (req, res, next) => {
        passport.authenticate('azure_ad_oauth2', { failWithError: true }, function (err, user, info) {
            if (!user || err) {
                return next(err)
            }
            req.logIn(user, function (error) {
                if (error) { return next(error); }
            })
            return next();
        })(req, res, next)
    },
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    logout: (req, res, next) => {
        passportUtils.deleteUserSession(req.user.id,req.sessionID)
        req.logout()
        req.session.destroy((err) => {
            if (err) {
                next(err)
            }

            next()
        })

    }
}
