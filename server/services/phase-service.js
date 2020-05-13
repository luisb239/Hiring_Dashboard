'use strict'

const AppError = require('../controllers/errors/app-error.js')
const errors = require('../controllers/errors/errors.js')

module.exports = (db) => {

    return {
        getPhasesByWorkflow: getPhasesByWorkflow,
    }

    async function getPhasesByWorkflow({workflow}) {
        return await db.getPhasesByWorkflow({workflow})
    }
}
