'use strict';

const PORT = process.argv[2] || '8080';

const api = 'hd';
const api_auth = 'auth';

const api_root = `/${api}`;
const api_auth_root = `${api_root}/${api_auth}`;

const hd_db = require('./db/hd_db.js')();
const hd_auth_db = require('./db/auth/hd_auth_db.js')(hd_db);

const hd_services = require('./services/hd_services.js')(hd_db);
const hd_auth_services = require('./services/auth/auth_services.js')(hd_auth_db);

const express = require('express');
const express_session = require('express-session');

const app = express()
app.use(express_session({
    resave: false,
    saveUninitialized: false,
    secret: 'hiring dashboard'
}));
app.use(express.json())
// app.use(express.static('dist'))

const hd_api = require('./routes/hd_api.js')(hd_services, express.Router())
const hd_auth_api = require('./routes/auth/hd_auth_api.js')(app, hd_auth_services, express.Router())

app.use(api_auth_root, hd_auth_api);
// app.use(api_root, verifyAuthenticated, hd_api); // Uncomment for required authentication
app.use(api_root, hd_api);

app.use(errorRequest)

// TODO
// Code repetition and should be in routes layer
function errorRequest(req, res) {
    res.status(404).send({error: "Resource not found!"})
}

// Code repetition and should be in routes layer
function verifyAuthenticated(req, rsp, next) {
    if (req.isAuthenticated())
        return next()
    rsp.status(403).json({message: "Not Authenticated"})
}

// Server listening on port
app.listen(PORT, () => console.log(`Server listening on port ${PORT} @ ${new Date()}`));