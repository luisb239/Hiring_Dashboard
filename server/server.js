'use strict'

const PORT = process.argv[2] || '8080'
// TODO:
//  should be environment variable -> process.env
//  or config file

const express = require('express')

const app = express()

app.use(express.json())
// app.use(express.static('dist'))

const db = require('./dals');

// Authentication Module
const authModule = require('../authization-module/authization')(app);

// TODO -> CHANGE development.json of their module instead
//  CHANGED development/testing/production to accept port 4200


const dbConfigs = authModule.configurations

dbConfigs.changeDatabaseOptions({
     sgbd: 'PG'
})

const services = require('./services')(db, authModule)

const controllers = require('./controllers')(services)

const routes = require('./controllers/routes.js')(app, express.Router(), controllers)

const cors = require('cors')
app.use(cors())

const root = 'hd'

app.use(`/${root}`, routes)

const notFound = require('./controllers/middlewares/not_found.js')

app.use(notFound)

// Server listening on port
app.listen(PORT, () => console.log(`Server listening on port ${PORT} @ ${new Date()}`));
