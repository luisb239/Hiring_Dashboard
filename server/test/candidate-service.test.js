'use strict'

const assert = require('assert')
const db = require('../dals')

const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

const service = require('../services/candidate-service')(db.candidate, db.profile, db.process, db.transaction)


describe('Testing request-props-service', () => {
    describe('Testing ....', () => {

    })
})
