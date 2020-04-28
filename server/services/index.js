'use strict'

module.exports = (db) => {

    const request = require('./requestService.js')(db.request)
    const candidate = require('./candidateService.js')(db.candidate)
    const skill = require('./requestAttrServices/skillService.js')(db.skill)

    return {
        request, candidate, skill
    }
}
