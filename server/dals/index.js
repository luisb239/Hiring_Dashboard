'use strict'

const {Pool} = require('pg')
const pool = new Pool()

function query(text, params) {
    return pool.query(text, params)
}

const request = require('./request-dal.js')(query)
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
const process = require('./process-dal.js')(query)
const user = require('./user-dal.js')(query)
const role = require('./role-dal.js')(query)
const info = require('./info-dal.js')(query)
const requestLanguage = require('./request-language-dal.js')(query)

module.exports = () => {
    return {
        request,
        candidate,
        skill,
        state,
        stateCsl,
        project,
        profile,
        language,
        workflow,
        phase,
        months,
        process,
        user,
        role,
        info,
        requestLanguage
    }
}
