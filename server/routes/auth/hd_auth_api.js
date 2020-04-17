'use strict';

const passport = require('passport');

module.exports = function (global, auth_service, router) {

    global.use(passport.initialize())
    global.use(passport.session())

    passport.serializeUser(serializeUser)
    passport.deserializeUser(deserializeUser)

    //router.get('/session', getSession)
    //router.post('/login', login)
    //router.post('/logout', logout)
    router.post('/sign_up', sign_up)

    return router

    function getSession(req, resp) {
        const isAuthenticated = req.isAuthenticated();
        const username = isAuthenticated ? req.user.username : undefined;
        resp.json({
            'auth': isAuthenticated,
            'username': username
        })
    }

    function login(req, resp) {
        auth_service
            .authenticate(req.body.username, req.body.password)
            .then(user => {
                req.login(user, (err) => {
                    if (err) sendUnauthorized(resp, err)
                    else resp.json(user)
                })
            })
            .catch(() => sendUnauthorized(resp, "Unable to authenticate"))
    }

    function logout(req, resp) {
        req.logout()
        getSession(req, resp)
    }

    function sign_up(req, resp) {
        auth_service
            .createUser(req.body.username, req.body.password)
            .then(user => {
                req.login(user, (err) => {
                    if (err) sendUnauthorized(resp, err)
                    else resp.json(user)
                });
            });
    }

    function serializeUser(user, done) {
        console.log('serializeUser')
        done(null, user.id)
    }

    function deserializeUser(userId, done) {
        console.log('deserializeUser')
        auth_service
            .getUserById(userId)
            .then(user => done(null, user))
            .catch(err => done(err))
    }

    function sendUnauthorized(resp, err) {
        resp.status(403).json({status: "Unauthorized", message: err})
    }

}