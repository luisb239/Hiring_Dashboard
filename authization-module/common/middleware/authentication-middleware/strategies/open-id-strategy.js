'use strict'

const
    OpenIDStrategy = require('passport-openid').Strategy

const strategy = new OpenIDStrategy({
        returnURL: 'http://localhost:8082/homepage',
        realm: 'http://localhost:8082',
        clientID: '523982739771-2hkfdqls3uapvlf0c111i6qhnidfgt44.apps.googleusercontent.com',
        clientSecret: 'vs0R8tvgMv2w2rhuHtRPT9nK'
    },
    function (identifier, done) {
    }
)

module.exports = strategy
