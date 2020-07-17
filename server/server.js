'use strict'
const PORT = process.argv[2] || '8080'

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const config = require('./config.js')(app)

const authModule = require('../authization-module/authization')

authModule.setup(config.app, config.dbOptions, config.jsonObj)
    .then(async (authModule) => {
        const db = require('./dals');
        const services = require('./services')(db, authModule)
        const controllers = require('./controllers')(services)
        const routes = require('./routes.js')(express.Router(), controllers, authModule, config.upload, config.validator)

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





