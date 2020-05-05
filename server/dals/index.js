'use strict'

const {Pool} = require('pg')
const pool = new Pool()

function query(text, params) {
    return pool.query(text, params)
}

module.exports = () => {

    const request = require('./requestDal.js')(query)
    const candidate = require('./candidateDal.js')(query)
    const skill = require('./requestPropsDal/skillDal.js')(query)
    const state = require('./requestPropsDal/stateDal.js')(query)
    const stateCsl = require('./requestPropsDal/stateCslDal.js')(query)
    const project = require('./requestPropsDal/projectDal.js')(query)
    const profile = require('./requestPropsDal/profileDal.js')(query)
    const language = require('./requestPropsDal/languageDal.js')(query)
    const workflow = require('./requestPropsDal/workflowDal.js')(query)

    return {
        request, candidate, skill, state, stateCsl, project, profile, language, workflow
    }
}
