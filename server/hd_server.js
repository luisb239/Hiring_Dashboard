'use strict'
const express = require('express')


const PORT = process.env.PORT || '8080';

const hd_db = require('./hd_db.js').init(DB_INFO)
const hd_services = require('./hd_services.js').init(hd_db)
const hd_api = require('./hd_api.js')(ciborgService, express.Router())

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use('/ciborg', ciborgApi)

let today = new Date();
app.listen(PORT,()=>console.log(`Server listening on port ${PORT} @ ${today}`))