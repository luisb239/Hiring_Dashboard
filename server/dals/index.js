'use strict'

const {Pool} = require('pg')
const pool = new Pool()

function query(text, params) {
    return pool.query(text, params)
}

module.exports = () => {

    const request = require('./requestDal.js')(query)
    const candidate = require('./candidate-dal.js')(query)
    const skill = require('./request-props-dal/skill-dal.js')(query)
    const state = require('./request-props-dal/state-dal.js')(query)
    const stateCsl = require('./request-props-dal/state-csl-dal.js')(query)
    const project = require('./request-props-dal/project-dal.js')(query)
    const profile = require('./request-props-dal/profile-dal.js')(query)
    const language = require('./request-props-dal/language-dal.js')(query)
    const months = require('./request-props-dal/months-dal.js')(query)
    const workflow = require('./request-props-dal/workflow-dal.js')(query)
    const phase = require('./phaseDal.js')(query)

    return {
        request, candidate, skill, state, stateCsl, project, profile, language, workflow, phase, months
    }
}