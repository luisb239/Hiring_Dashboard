'use strict'

module.exports = (db) => {

    const request = require('./request-service.js')(db.request, db.candidate, db.user, db.role, db.requestLanguage)
    const candidate = require('./candidate-service.js')(db.candidate, db.profile)
    const skill = require('./request-props-services/skill-service.js')(db.skill)
    const state = require('./request-props-services/state-service.js')(db.state)
    const stateCsl = require('./request-props-services/state-csl-service.js')(db.stateCsl)
    const project = require('./request-props-services/project-service.js')(db.project)
    const profile = require('./request-props-services/profile-service.js')(db.profile)
    const language = require('./request-props-services/language-service.js')(db.language)
    const workflow = require('./request-props-services/workflow-service.js')(db.workflow, db.phase)
    const months = require('./request-props-services/months-service.js')(db.months)
    const phase = require('./phase-service.js')(db.phase, db.info)

    const process = require('./process-service.js')(db.request, db.candidate, db.process)

    return {
        request, candidate, skill, state, stateCsl, project, profile, language, workflow, phase, months, process
    }
}
