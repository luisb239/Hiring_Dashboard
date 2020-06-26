'use strict'

const PORT = process.argv[2] || '8080'

const express = require('express')

const fileUpload = require('express-fileupload')

const app = express()

const nodemailer = require("nodemailer")

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const dbOptions = {
    "host": process.env.PGHOST,
    "port": process.env.PGPORT,
    "user": process.env.PGUSER,
    "password": process.env.PGPASSWORD,
    "connectionLimit": 5,
    "database": process.env.PGDATABASE,
    "sgbd": "postgres"
}

const jsonObj = {
    "roles": ["admin", "recruiter", "jobOwner", "guest"],
    "permissions": [
        {"resource": "auth", "action": "GET"},
        {"resource": "auth", "action": "POST"},

        {"resource": "requests", "action": "GET"},
        {"resource": "requests", "action": "POST"},
        {"resource": "requests", "action": "PUT"},

        {"resource": "workflows", "action": "GET"},

        {"resource": "phases", "action": "GET"},

        {"resource": "requests-properties", "action": "GET"},

        {"resource": "candidates", "action": "GET"},
        {"resource": "candidates", "action": "POST"},
        {"resource": "candidates", "action": "PUT"},

        {"resource": "process", "action": "GET"}

    ],
    "grants": {
        //TODO -> guest permissions
        "guest": [
            {"resource": "auth", "action": "GET"},
            {"resource": "auth", "action": "POST"},

            {"resource": "requests", "action": "GET"},
            {"resource": "requests", "action": "POST"},
            {"resource": "requests", "action": "PUT"},

            {"resource": "workflows", "action": "GET"},
            {"resource": "phases", "action": "GET"},
            {"resource": "requests-properties", "action": "GET"},
            {"resource": "candidates", "action": "GET"},
            {"resource": "candidates", "action": "POST"},
            {"resource": "candidates", "action": "PUT"},
            {"resource": "process", "action": "GET"},
        ],
        "recruiter": [
            {"role": "guest"}
        ],
        "jobOwner": [
            {"role": "guest"}
        ],
        "admin": [
            {"role": "guest"}
        ]
    }
}

nodemailer.createTransport({
    pool: true,
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // use TLS
    auth: {
        user: "hiring.dashboard.isel@gmail.com",
        pass: "9TzNmdZc6IAxhKOL"
    }
}).verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

const authModule = require('../authization-module/authization')

authModule.setup(app, dbOptions, jsonObj)
    .then(async (authModule) => {

        const db = require('./dals');

        const services = require('./services')(db, authModule)

        const controllers = require('./controllers')(services)

        const routes = require('./controllers/routes.js')(express.Router(), controllers, authModule)

        const root = 'hd'

        app.use(`/${root}`, routes)

        const notFoundMiddleware = require('./controllers/middlewares/not_found.js')

        app.use(notFoundMiddleware)

        //express error handler
        app.use(function (err, req, res) {
            console.log(err.stack)
            res.status(err.status || 500).send({message: err.message || 'Something went wrong. Please try again later.'})
        })

        // Server listening on port
        app.listen(PORT, () => console.log(`Server listening on port ${PORT} @ ${new Date()}`))
    })





