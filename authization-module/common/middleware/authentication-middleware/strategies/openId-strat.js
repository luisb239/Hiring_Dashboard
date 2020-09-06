const OpenIDStrategy = require('passport-openid').Strategy;

const openIdStratBuilder = () => new OpenIDStrategy({
        returnURL: 'http://localhost:8082/homepage',
        realm: 'http://localhost:8082',
        clientID: '523982739771-2hkfdqls3uapvlf0c111i6qhnidfgt44.apps.googleusercontent.com',
        clientSecret: 'vs0R8tvgMv2w2rhuHtRPT9nK',
    }, (identifier, done) => {/*function is empty cause ...*/
    }
);
module.exports = openIdStratBuilder;
