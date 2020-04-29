'use strict'

module.exports = (service) => {

    const request = require('./requestController.js')(service.request)
    // request-properties
    const state = require('./requestPropsControllers/stateController.js')(service.state)
    const skill = require('./requestPropsControllers/skillController.js')(service.skill)
    const stateCsl = require('./requestPropsControllers/stateCslController.js')(service.stateCsl)
    const project = require('./requestPropsControllers/projectController.js')(service.project)
    const profile = require('./requestPropsControllers/profileController.js')(service.profile)
    const language = require('./requestPropsControllers/languageController.js')(service.language)
    const workflow = require('./requestPropsControllers/workflowController.js')(service.workflow)

    const candidate = require('./candidateController.js')(service.candidate)

    return {request, candidate, state, skill, stateCsl, project, profile, language, workflow}

}
