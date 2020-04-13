'use strict'
const express = require('express')

const PORT = process.argv[2] || '8080';

const api_root = 'hd';

const hd_db = require('./db/hd_db.js')()
const hd_services = require('./services/hd_services.js')(hd_db)
const hd_api = require('./routes/hd_api.js')(hd_services, express.Router())

const app = express()
app.use(express.json())
// app.use(express.static('dist'))
app.use(`/${api_root}`, hd_api)

app.listen(PORT,()=>console.log(`Server listening on port ${PORT} @ ${new Date()}`))