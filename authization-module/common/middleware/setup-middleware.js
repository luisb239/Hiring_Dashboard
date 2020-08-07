
const
    passport = require('./authentication-middleware/passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    userHistory = require('../../resources/dals/users-history-dal'),
    authorization = require('../../resources/authorizations')

// This module is used to setup middleware on the app passed as a parameter
module.exports = function (app, session) {

    // Makes it easier to manage the request's body
    app.use(bodyParser.json());

    // Makes it easier to manage cookies
    app.use(cookieParser());

    // set up session middleware
    app.use(session);
    app.use(passport.initialize());
    app.use(passport.session());


    app.use((req, res, next) => userHistory.saveHistory(req, res, next))

    //Interceptor that checks for authorization
    //app.use((req, res, next) => req.path.includes('api') ? authorization.check(req, res, next) : next());

};
