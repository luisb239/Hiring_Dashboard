'use strict'

const PORT = process.argv[2] || '8080'

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const config = require('./config.js')()
const authModule = require('../authization-module/authization')

authModule.setup({app: app, db: config.dbOptions, rbac_opts: config.jsonObj, https: false, strategies: undefined})
    .then(async (auth) => {
        const db = require('./dals')
        const services = require('./services')(db, auth, config.transporter)
        const controllers = require('./controllers')(services)
        const routes = require('./routes/routes.js')(express.Router(), controllers, auth, config.upload, config.validator)

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





