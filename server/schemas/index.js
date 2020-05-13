'use strict'

const requests = require('./request-schema.js')
const candidates = require('./candidate-schema.js')
const skill = require('./request-props-schemas/skill-schema.js')
const state = require('./request-props-schemas/state-schema.js')
const stateCsl = require('./request-props-schemas/state-csl-schema.js')
const project = require('./request-props-schemas/project-schema.js')
const profile = require('./request-props-schemas/profile-schema.js')
const workflow = require('./request-props-schemas/workflow-schema.js')
const language = require('./request-props-schemas/language-schema.js')
const months = require('./request-props-schemas/months-schema.js')
const userRoleRequest = require('./userRoleRequestSchema.js')
const phase = require('./phase-schema.js')
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
    months,
    userRoleRequest,
    phase,
    workflowPhase
}
