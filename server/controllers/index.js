'use strict'

module.exports = (service) => {

    const request = require('./requestController.js')(service.request)
    const state = require('./requestAttrControllers/stateController.js')(service.state)
    const skill = require('./requestAttrControllers/skillController.js')(service.skill)
    const candidate = require('./candidateController.js')(service.candidate)

    return {request, candidate, state, skill}

}
