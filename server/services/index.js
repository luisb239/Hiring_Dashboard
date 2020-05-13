'use strict'

module.exports = (db) => {

    const request = require('./request-service.js')(db.request)
    const candidate = require('./candidate-service.js')(db.candidate)
    const skill = require('./request-props-services/skill-service.js')(db.skill)
    const state = require('./request-props-services/state-service.js')(db.state)
    const stateCsl = require('./request-props-services/state-csl-service.js')(db.stateCsl)
    const project = require('./request-props-services/project-service.js')(db.project)
    const profile = require('./request-props-services/profile-service.js')(db.profile)
    const language = require('./request-props-services/language-service.js')(db.language)
    const workflow = require('./request-props-services/workflow-service.js')(db.workflow)
    const months = require('./request-props-services/months-service.js')(db.months)
    const phase = require('./phase-service.js')(db.phase)

    return {
        request, candidate, skill, state, stateCsl, project, profile, language, workflow, phase, months
    }
}
