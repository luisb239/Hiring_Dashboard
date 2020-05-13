'use strict'

module.exports = (service) => {

    const request = require('./request-controller.js')(service.request)

    // request-properties
    const state = require('./request-props-controllers/state-controller.js')(service.state)
    const skill = require('./request-props-controllers/skill-controller.js')(service.skill)
    const stateCsl = require('./request-props-controllers/state-csl-controller.js')(service.stateCsl)
    const project = require('./request-props-controllers/project-controller.js')(service.project)
    const profile = require('./request-props-controllers/profile-controller.js')(service.profile)
    const language = require('./request-props-controllers/language-controller.js')(service.language)
    const workflow = require('./request-props-controllers/workflow-controller.js')(service.workflow)
    const months = require('./request-props-controllers/months-controller.js')(service.months)

    const phase = require('./phase-controller.js')(service.phase)

    const candidate = require('./candidate-controller.js')(service.candidate)

    return {request, candidate, state, skill, stateCsl, project, profile, language, workflow, phase, months}

}
