'use strict'

const PORT = process.argv[2] || '8080'
// Should be environment variable -> process.env

const express = require('express')
const express_session = require('express-session')

const app = express()

app.use(express.json())
// app.use(express.static('dist'))

const db = require('./dals')();

const services = require('./services')(db)

const controllers = require('./controllers')(services)

const routes = require('./controllers/routes.js')(app, express.Router(), controllers)

//const cors = require('cors')
//app.use(cors())

const root = 'hd'

app.use(`/${root}`, routes)

const notFound = require('./controllers/middlewares/not_found.js')

app.use(notFound)

// Server listening on port
app.listen(PORT, () => console.log(`Server listening on port ${PORT} @ ${new Date()}`));
