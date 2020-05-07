'use strict'

const AppError = require('../utils/errors/app_error.js')
const errors = require('../utils/errors/errors_type.js')

module.exports = (db) => {

    return {
        getPhasesByWorkflow: getPhasesByWorkflow,
    }

    async function getPhasesByWorkflow({workflow}) {
        return await db.getPhasesByWorkflow({workflow})
    }
}
