'use strict'

const
    passport = require('./passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    cookieSecret = 'justasecretstring', // should change after a while if it has some security implication openssl rand -hex 32 on the cmd
    config = require('../config/config'),
    KnexSessionStore = require("connect-session-knex")(session),
    Knex = require('knex');

const knex = Knex({
    client: config.sgbd,
    connection: config.database_opts
});

const store = new KnexSessionStore({
    knex: knex,
    tablename: "sessions" // optional. Defaults to 'sessions'
});

// This module is used to setup middleware on the app passed as a parameter
module.exports = function (app) {

    // Accept request's from different origins, necessary to use our web application
    app.use(require('cors')({
        // how to change origins between clients
        "origin": config.webAppUri,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "credentials": true
    }))
    // app configurations

    // Makes it easier to manage the request's body
    app.use(bodyParser.json())

    // Makes it easier to manage cookies
    app.use(cookieParser())

    // set up session middleware
    app.use(session({
        // to keep session active instead of letting it change to the idle state
        resave: false,
        //saveUninitialized to false to only create a session if a UA(User agent) made a login
        saveUninitialized: false,
        store: store,
        secret: cookieSecret,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    }))

    app.use(passport.initialize())
    app.use(passport.session())

    //Interceptor that checks for authorization
    //app.use(
    //  (req, res, next) => req.url.includes('authentications') ? next() : authorization.check(req, res, next)
    //)

    config.isModuleSetUp = true
}
