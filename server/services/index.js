'use strict'

module.exports = (db) => {

    const request = require('./requestService.js')(db.request)
    const candidate = require('./candidateService.js')(db.candidate)
    const skill = require('./requestPropsServices/skillService.js')(db.skill)
    const state = require('./requestPropsServices/stateService.js')(db.state)
    const stateCsl = require('./requestPropsServices/stateCslService.js')(db.stateCsl)
    const project = require('./requestPropsServices/projectService.js')(db.project)
    const profile = require('./requestPropsServices/profileService.js')(db.profile)
    const language = require('./requestPropsServices/languageService.js')(db.language)
    const workflow = require('./requestPropsServices/workflowService.js')(db.workflow)

    return {
        request, candidate, skill, state, stateCsl, project, profile, language, workflow
    }
}
