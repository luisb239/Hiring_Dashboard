'use strict'

/*
const passport = require('passport')

module.exports = function (global, auth_service, router) {

    global.use(passport.initialize())
    global.use(passport.session())

    passport.serializeUser(serializeUser)
    passport.deserializeUser(deserializeUser)

    router.get('/session', getSession)
    router.post('/login', verifyNotAuthenticated, login)
    router.post('/logout', verifyAuthenticated, logout)
    router.post('/sign_up', verifyNotAuthenticated, sign_up)

    return router


    function verifyNotAuthenticated(req, res, next) {
        if (!req.isAuthenticated())
            return next()
        sendUnauthorized(res, "Already Authenticated")
    }

    // Code repetition and should be in controllers layer
    function verifyAuthenticated(req, rsp, next) {
        if (req.isAuthenticated())
            return next()
        rsp.status(403).json({message: "Not Authenticated"})
    }

    function getSession(req, res) {
        const isAuthenticated = req.isAuthenticated();
        const username = isAuthenticated ? req.user.username : undefined;
        res.json({
            'auth': isAuthenticated,
            'username': username
        })
    }

    function login(req, res) {
        auth_service
            .authenticate(req.body.username, req.body.password)
            .then(user => {
                req.login(user, (err) => {
                    if (err) sendUnauthorized(res, err)
                    else res.json(user)
                })
            })
            .catch(err => sendUnauthorized(res, err))
    }

    function logout(req, res) {
        auth_service
            .logout(req.user)
            .then(() => {
                req.logout()
                getSession(req, res)
            })
    }

    function sign_up(req, res) {
        auth_service
            .createUser(req.body.username, req.body.password)
            .then(user => {
                req.login(user, (err) => {
                    if (err) sendUnauthorized(res, err)
                    else res.json(user)
                });
            })
            .catch(err => sendUnauthorized(res, err))
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

    function sendUnauthorized(res, err) {
        res.status(403).json({status: "Unauthorized", message: err})
    }

}
*/
