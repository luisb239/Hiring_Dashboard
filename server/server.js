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

    ],
    "grants": {
        //TODO -> change guest permissions -> only temporary for postman tests
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

const authModule = require('../authization-module/authization')

authModule.setup(app, dbOptions, jsonObj)
    .then(async (authModule) => {

        // SETUP DB VALUES

        //Add default users + their roles
        let user1 = await authModule.user.getByUsername("A44015@alunos.isel.pt")
        if (!user1) {
            //id = 1
            user1 = (await authModule.user.create("A44015@alunos.isel.pt", null)).dataValues
        }

        let user2 = await authModule.user.getByUsername("A43553@alunos.isel.pt")
        if (!user2) {
            //id = 2
            user2 = (await authModule.user.create("A43553@alunos.isel.pt", null)).dataValues
        }

        let user3 = await authModule.user.getByUsername("A43520@alunos.isel.pt")
        if (!user3) {
            //id = 3
            user3 = (await authModule.user.create("A43520@alunos.isel.pt", null)).dataValues
        }

        const recruiter = await authModule.role.getByName("recruiter")

        const userRoles = await authModule.userRole.getAll()
        if (!userRoles) {
            await authModule.userRole.create(user1.id, recruiter.id, null, null, null, true)
            await authModule.userRole.create(user2.id, recruiter.id, null, null, null, true)
            await authModule.userRole.create(user3.id, recruiter.id, null, null, null, true)
        }

        // SETUP DB VALUES

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





