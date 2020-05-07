'use strict'

const requests = require('./requestSchema.js')
const candidates = require('./candidateSchema.js')
const skill = require('./requestAttrSchemas/skillSchema.js')
const state = require('./requestAttrSchemas/stateSchema.js')
const stateCsl = require('./requestAttrSchemas/stateCslSchema.js')
const project = require('./requestAttrSchemas/projectSchema.js')
const profile = require('./requestAttrSchemas/profileSchema.js')
const workflow = require('./requestAttrSchemas/workflowSchema.js')
const language = require('./requestAttrSchemas/languageSchema.js')
const userRoleRequest = require('./userRoleRequestSchema.js')
const phase = require('./phaseSchema.js')
const workflowPhase = require('./workflowPhaseSchema.js')

module.exports = {
    requests,
    candidates,
    skill,
    state,
    stateCsl,
    project,
    profile,
    workflow,
    language,
    userRoleRequest,
    phase,
    workflowPhase
}
