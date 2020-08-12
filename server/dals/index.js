'use strict'

const {Pool} = require('pg')

const pool = new Pool()

const errors = require('./errors/db-errors.js')
const DbError = require('./errors/db-access-error.js')

async function query(text, client) {
    try {
        if(client)
            return await client.query(text)
        else
            return await pool.query(text)
    } catch (e) {
        // log the error
        console.log(e)
        // check the pg error code and throw respective exception to service layer
        checkAndThrowError(e)
    }
}

async function transaction(bodyFunction) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        const result = await bodyFunction(client)
        await client.query('COMMIT')
        return result
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}

// TODO -> NEEDS REFACTORING -> Dictionary

function checkAndThrowError(e) {
    const errorCode = e.code.substr(0, 2)
    if (errorCode === '08') {
        throw new DbError(errors.typeErrors.connectionException)
    } else if (errorCode === '22') {
        throw new DbError(errors.typeErrors.invalidData)
    } else if (errorCode === '23') {
        if (e.code === '23503') {
            throw new DbError(errors.typeErrors.integrityViolation, errors.detailErrors.foreignKeyViolation)
        } else if (e.code === '23505') {
            throw new DbError(errors.typeErrors.integrityViolation, errors.detailErrors.uniqueViolation)
        } else throw new DbError(errors.typeErrors.integrityViolation)
    } else if (errorCode === '42') {
        throw new DbError(errors.typeErrors.syntaxErrorOrAccessRuleViolation)
    } else if (errorCode === '53') {
        throw new DbError(errors.typeErrors.insufficientResources)
    } else if (errorCode === 'P0') {
        throw new DbError(errors.typeErrors.pgSqlError)
    } else throw new DbError(errors.typeErrors.internalError)
}

const request = require('./request/request-dal.js')(query)
const candidate = require('./candidate-dal.js')(query)
const skill = require('./request-props-dal/skill-dal.js')(query)
const state = require('./request-props-dal/state-dal.js')(query)
const stateCsl = require('./request-props-dal/state-csl-dal.js')(query)
const project = require('./request-props-dal/project-dal.js')(query)
const profile = require('./request-props-dal/profile-dal.js')(query)
const language = require('./request-props-dal/language-dal.js')(query)
const months = require('./request-props-dal/months-dal.js')(query)
const workflow = require('./request-props-dal/workflow-dal.js')(query)
const phase = require('./phase-dal.js')(query)
const process = require('./process/process-dal.js')(query)
const user = require('./users/user-dal.js')(query)
const role = require('./users/role-dal.js')(query)
const info = require('./info-dal.js')(query)
const requestLanguage = require('./request/request-language-dal.js')(query)
const processUnavailableReason = require('./process/process-unavailable-reason-dal.js')(query)
const processPhases = require('./process/process-phases-dal.js')(query)
const processInfo = require('./process/process-info-dal.js')(query)
const reasons = require('./process/unavailable-reasons-dal.js')(query)
const status = require('./process/status-dal.js')(query)
const statistics = require('./statistics-dal.js')(query)

module.exports = {
    request, candidate, skill, state, stateCsl, project, profile,
    language, workflow, phase, months, process, user, role, info, requestLanguage,
    processUnavailableReason, processPhases, processInfo, reasons, status, statistics,
    transaction
}
