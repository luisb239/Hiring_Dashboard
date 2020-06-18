'use strict'

const PORT = process.argv[2] || '8080'
// TODO:
//  should be environment variable -> process.env
//  or config file

const express = require('express')

const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

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
    "roles": ["admin", "DbManager", "Developer", "guest"],
    "permissions": [
        {"resource": "hd", "action": "GET"},
        {"resource": "authentications", "action": "GET"},
        {"resource": "authentications", "action": "POST"},
        {"resource": "users", "action": "GET"},
        {"resource": "permissions", "action": "GET"},
        {"resource": "roles", "action": "GET"},
        {"resource": "roles", "action": "POST"},
        {"resource": "lists", "action": "GET"}],

    "grants": {
        "DbManager": [{"resource": "users", "action": "GET"}, {"resource": "roles", "action": "GET"}],
        "guest": [{"resource": "authentications", "action": "GET"}, {"resource": "authentications", "action": "POST"}],
        "admin": [
            {"role": "DbManager"}, {"role": "guest"},
            {
                "resource": "permissions",
                "action": "GET"
            },
            {"resource": "lists", "action": "GET"}]
    }
}


const authModule = require('../authization-module/authization')

authModule.setup(app, dbOptions, jsonObj)
    .then((authModule) => {
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
            res.status(err.status || 500).send({message: err.message || 'Something unexpected error. Please try again later.'})
        })

        // Server listening on port
        app.listen(PORT, () => console.log(`Server listening on port ${PORT} @ ${new Date()}`));
    })





