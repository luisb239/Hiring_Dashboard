'use strict'

const {Pool, types} = require('pg')
const pool = new Pool()

// By default, node-postgres, when fetching timestamps from database, will convert them to Date objects.
// By doing this, the timestamps lose their precision (Date objects dont hold microseconds).

// node-postgres timestamp default behavior:
// types.setTypeParser(types.builtins.TIMESTAMP, (timestamp) => timestamp ? new Date(timestamp) : null)

// And so, converting the timestamp to a Date object will also corrupt the current concurrency system in place.
// We need to force node-postgres to not modify timestamps, and instead return them as they come from database.
types.setTypeParser(types.builtins.TIMESTAMP, (timestamp) => timestamp)

const errors = require('./errors/db-errors.js')
const DbError = require('./errors/db-access-error.js')

async function query(text, client) {
    try {
        return client ? await client.query(text) : await pool.query(text)
    } catch (e) {
        throwDatabaseError(e)
    }
}

async function transaction(fn) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        // PostgreSQL default isolation level -> READ COMMITTED
        const result = await fn(client)
        await client.query('COMMIT')
        return result
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
}

function throwDatabaseError(e) {
    let error;
    // More errors could be added
    if (e.code.substr(0, 2) === '23') {
        if (e.code === '23503') error = errors.foreignKeyViolation
        if (e.code === '23505') error = errors.uniqueViolation
    }
    throw new DbError(error || errors.internalError, e.stack || e)
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
