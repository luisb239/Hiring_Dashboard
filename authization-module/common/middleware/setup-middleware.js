'use strict'

const
    passport = require('./authentication-middleware/passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    authorization = require('../../resources/authorizations')

// This module is used to setup middleware on the app passed as a parameter
module.exports = function (app, session) {

    // Makes it easier to manage the request's body
    app.use(bodyParser.json())

    // Makes it easier to manage cookies
    app.use(cookieParser())

    // set up session middleware
    app.use(session)

    app.use(passport.initialize())
    app.use(passport.session())

    //Interceptor that checks for authorization
   app.use(authorization.check)
}
